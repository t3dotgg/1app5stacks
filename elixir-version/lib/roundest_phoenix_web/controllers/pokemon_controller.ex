defmodule RoundestPhoenixWeb.PokemonController do
  use RoundestPhoenixWeb, :controller
  alias RoundestPhoenix.Pokemons

  def show_results(conn, _params) do
    pokemon = Pokemons.get_pokemon_by_win_rate()
    render(conn, :results, pokemon: pokemon)
  end
end
