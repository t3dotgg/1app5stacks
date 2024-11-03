class CreateVotes < ActiveRecord::Migration[6.1]
  def change
    create_table :votes do |t|
      t.references :winner, null: false, foreign_key: { to_table: :pokemons }
      t.references :loser, null: false, foreign_key: { to_table: :pokemons }

      t.timestamps
    end
  end
end