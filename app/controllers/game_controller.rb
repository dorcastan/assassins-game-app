class GameController < ApplicationController

    def current_day
        render json: {
            data: {
                day: current_game.current_day
            }
        }
    end

    # Arranges for one player (killer) to kill another player (victim).
    # Killers cannot kill the same victim twice.
    def kill
        killer_id = params.require(:killer)
        victim_id = params.require(:victim)

        killer = Player.find(killer_id)
        victim = Player.find(victim_id)
        if killer == victim
            render json: {
                status: 6 # killer == victim
            }
        elsif !killer.status || !victim.status
            render json: {
                status: 2 # killer or victim is dead
            }
        elsif victim.killers.include?(killer)
            render json: {
                status: 3 # has been killed by same person before
            }
        else
            killer.points += victim.level * 100
            victim.status = false
            victim.save
            killer.save

            if Kill.create(killer: killer, victim: victim, day: current_game.current_day)
                render json: {
                    status: 0, # success
                    killer: killer,
                    victim: victim
                }
            else
                render json: {
                    status: 1 # failure
                }
            end
        end
    end

    # Increments a player's level.
    def level_up
        id = params.require(:id)
        player = Player.find(id)
        player.level += 1
        if !player.save
            render json: {
                status: 1
            }
        else
            render json: {
                status: 0,
                player: player
            }
        end
    end
    
    # Revives a dead player.
    def revive
        id = params.require(:id)
        player = Player.find(id)
        if player.status
            render json: {
                status: 2, # player is not dead
            }
        else
            player.status = true
            if !player.save
                render json: {
                    status: 1 # failure
                }
            else
                render json: {
                    status: 0, # success
                    player: player,
                }
            end
        end
    end

    # Increments current_day and updates players' levels.
    def next_day
        game = current_game
        if game.current_day > 10
            render json: {
                status: 5 # invalid day
            }
        elsif !update_all(game.current_day.to_s)
            render json: {
                status: 1 # failed to save
            }
        else
            game.current_day += 1
            if game.save
                render json: {
                    status: 0,
                    day: current_game.current_day
                }
            else
                render json: {
                    status: 1 # failure
                }
            end
        end
    end

    #======================================================
    # Extra methods in case someone needs to undo

    def undo_kill
        killer_id = params.require(:killer)
        victim_id = params.require(:victim)

        killer = Player.find(killer_id)
        victim = Player.find(victim_id)
        wrong_kill = Kill.where(killer_id: killer.id, victim_id: victim.id)

        if !killer.status || victim.status
            render json: {
                status: 2 # killer is dead or victim is still alive
            }
        elsif wrong_kill.empty? || !victim.killers.include?(killer) || !killer.victims.include?(victim)
            render json: {
                status: 4 # wrong killer-victim pair
            }
        elsif wrong_kill[0].day != current_game.current_day
            render json: {
                status: 7 # kill was on a different day
            }
        elsif killer.points < victim.level * 100
            render json: {
                status: 10 # critical bug somewhere (logic error)
            }
        else
            killer.points -= victim.level * 100
            victim.status = true
            victim.save
            killer.save
            wrong_kill[0].destroy  # should only have one wrong_kill anyway

            render json: {
                status: 0, # success
                killer: killer,
                victim: victim
            }
        end
    end

    def undo_level_up
        id = params.require(:id)
        player = Player.find(id)
        if player.level == 1
            render json: {
                status: 2 # Player is at lowest level
            }
        else
            player.level -= 1
            if !player.save
                render json: {
                    status: 1
                }
            else
                render json: {
                    status: 0,
                    player: player
                }
            end
        end
    end

    def undo_revive
        id = params.require(:id)
        player = Player.find(id)
        if !player.status
            render json: {
                status: 2 # player was not alive
            }
        else
            player.status = false
            if !player.save
                render json: {
                    status: 1 # failure
                }
            else
                render json: {
                    status: 0, # success
                    player: player,
                }
            end
        end
    end

    # Decrements current_day and updates players' levels.
    def undo_next_day
        game = current_game
        if game.current_day == 1
            render json: {
                status: 5 # invalid day
            }
        elsif !undo_update_all(game.current_day - 1)
            render json: {
                status: 1 # failed to save
            }
        else
            game.current_day -= 1
            if game.save
                render json: {
                    status: 0,
                    day: current_game.current_day
                }
            else
                render json: {
                    status: 1 # failure
                }
            end
        end
    end

    #======================================================
    private

    def current_game
        Game.all[0]
    end

    def update_all(day)
        players_to_update = Set[]
        for kill in Kill.where(day: day)
            players_to_update << kill.killer
        end
        for player in players_to_update
            player.level += 1
            if !player.save
                return false
            end
        end
        return true
    end

    def undo_update_all(day)
        players_to_update = Set[]
        for kill in Kill.where(day: day)
            players_to_update << kill.killer
        end
        for player in players_to_update
            if player.level == 1
                return false
            end
            player.level -= 1
            if !player.save
                return false
            end
        end
        return true
    end
end
