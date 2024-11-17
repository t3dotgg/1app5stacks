defmodule RoundestPhoenixWeb.PRELOADPokeLive do
  use RoundestPhoenixWeb, :live_view
  alias RoundestPhoenix.Pokemons

  def mount(_params, _session, socket) do
    if connected?(socket) do
      keys =
        [:first_entry, :second_entry, :next_first_entry, :next_second_entry]

      {:ok, assign(socket, :pokemons, Pokemons.get_random_pokemons(keys))}
    else
      {:ok, assign(socket, :pokemons, nil)}
    end
  end

  def handle_event("vote", %{"value" => id}, %{assigns: %{pokemons: pokemons}} = socket) do
    Task.start(fn ->
      Pokemons.vote(String.to_integer(id), pokemons.first_entry, pokemons.second_entry)
    end)

    {:noreply, assign(socket, :pokemons, next_pokemons(pokemons))}
  end

  defp next_pokemons(pokemons) do
    new_randoms =
      RoundestPhoenix.Pokemons.get_random_pokemons([:next_first_entry, :next_second_entry])

    %{
      first_entry: pokemons.next_first_entry,
      second_entry: pokemons.next_second_entry,
      next_first_entry: new_randoms.next_first_entry,
      next_second_entry: new_randoms.next_second_entry
    }
  end
end
