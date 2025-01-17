class Kill < ApplicationRecord
    belongs_to :killer, class_name: 'Player', foreign_key: :killer_id
    belongs_to :victim, class_name: 'Player', foreign_key: :victim_id

    validates :killer, presence: true
    validates :victim, presence: true
    validates :day, presence: true
end
