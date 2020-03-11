class CreateGames < ActiveRecord::Migration[6.0]
  def change
    create_table :games do |t|
      t.integer :current_day
    end

    add_reference :players, :game, foreign_key: true
  end
end
