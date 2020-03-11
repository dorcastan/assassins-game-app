class CreatePlayersAndKills < ActiveRecord::Migration[6.0]
  def change
    create_table :players do |t|
      t.string :name
      t.integer :level
      t.boolean :status
      t.integer :points

      t.timestamps
    end

    create_table :kills do |t|
      t.references :killer
      t.references :victim

      t.timestamps
    end
  end
end
