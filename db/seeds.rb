# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

all_players = [
    "Amber",
    "Harini",
    "Joey",
    "Syafiq",
    "Avani",
    "Dorcas",
    "Edwin",
    "Heng Wei",
    "Denesh",
    "Imti",
    "Kate",
    "Tze-Yin",
    "Btoh",
    "Greg",
    "Megan",
    "Nigel",
    "Isaac Lee",
    "Nicole",
    "Small Steph",
    "Zhen Ying",
    "Gang Xin",
    "Hwee Jen",
    "Jia Xuan",
    "Sloke",
    "Hwee Hiang",
    "Hwee Shuen",
    "Renee",
    "Small Lawrence",
    "VTeo",
    "Felicia",
    "Jingles",
    "Li Xin",
    "Rachel Mok",
    "Zi Xuan",
    "Clare",
    "Jun Wei",
    "Mark",
    "Mels",
    "Ser Ning",
    "Ananya",
    "Emil",
    "Jasmine",
    "Kelly",
    "Shuen Wei",
    "Isa",
    "Jeremiah",
    "Marcus",
    "Rachel Sng",
    "Tian Tian",
    "Ben-Hanan",
    "Germs",
    "Malcolm",
    "Steph Chay",
    "Ting Yi",
    "Daphnne",
    "Ivan",
    "Mags",
    "Shengs",
    "Vivian",
]

for name in all_players
    Player.create(name: name, level: 1, status: true, points: 0, game_id: 1)
end
