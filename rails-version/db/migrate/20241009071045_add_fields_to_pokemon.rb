class AddFieldsToPokemon < ActiveRecord::Migration[7.1]
  def change
    add_column :pokemons, :name, :string
    add_column :pokemons, :dex_id, :integer
    add_column :pokemons, :sprite, :string
  end
end
