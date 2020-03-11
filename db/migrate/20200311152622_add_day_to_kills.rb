class AddDayToKills < ActiveRecord::Migration[6.0]
  def change
    add_column :kills, :day, :integer
  end
end
