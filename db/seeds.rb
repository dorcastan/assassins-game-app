# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

player_names = [
    'Marcus', 'Nawat', 'Phoebe', "Yi Leo", "Dana", "Isa", "Jasmine", 
    "Hannah", "Lynette", "Melody", "Nigel", "Sheng Wei", "Harini"
]

for name in player_names
    Player.create(name: name, level: 1, status: true, points: 0)
end
