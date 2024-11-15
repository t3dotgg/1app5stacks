class AddCounterCacheToPokemon < ActiveRecord::Migration[7.1]
  def change
    add_column :pokemons, :won_votes_count, :integer, default: 0
    add_column :pokemons, :lost_votes_count, :integer, default: 0
  end
end
