class Game < ApplicationRecord
    has_many :players

    validates :current_day, presence: true
end
