class GameController < ApplicationController

    def kill
        killer_id = params.require(:killer)
        victim_id = params.require(:victim)

        killer = Player.find(killer_id)
        victim = Player.find(victim_id)
        if !killer.status || !victim.status
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

            if Kill.create(killer: killer, victim: victim)
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
    
    def revive
        id = params.require(:id)
        player = Player.find(id)
        if player.status
            render json: {
                status: 2 # player is not dead
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

    # Extra methods in case someone messes up

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
end