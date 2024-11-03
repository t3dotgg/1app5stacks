class CreatePokemons < ActiveRecord::Migration[7.1]
  def change
    create_table :pokemons do |t|

      t.timestamps
    end
  end
end
