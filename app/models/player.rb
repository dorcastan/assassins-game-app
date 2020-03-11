class Player < ApplicationRecord
    has_many :kill_list, foreign_key: :killer_id, class_name: 'Kill'
    has_many :victims, through: :kill_list

    has_many :killed_by_list, foreign_key: :victim_id, class_name: 'Kill'
    has_many :killers, through: :killed_by_list

    belongs_to :game

    validates :name, presence: true
    validates :level, presence: true
    # validates :status, presence: true
    validates :points, presence: true
    validates :game, presence: true
end
