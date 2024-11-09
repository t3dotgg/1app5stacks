# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_11_09_135629) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "pokemons", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.integer "dex_id"
    t.string "sprite"
    t.integer "won_votes_count", default: 0
    t.integer "lost_votes_count", default: 0
  end

  create_table "votes", force: :cascade do |t|
    t.bigint "winner_id", null: false
    t.bigint "loser_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["loser_id"], name: "index_votes_on_loser_id"
    t.index ["winner_id"], name: "index_votes_on_winner_id"
  end

  add_foreign_key "votes", "pokemons", column: "loser_id"
  add_foreign_key "votes", "pokemons", column: "winner_id"
end
