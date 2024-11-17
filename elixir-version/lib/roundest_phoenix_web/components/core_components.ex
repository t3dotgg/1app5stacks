defmodule RoundestPhoenixWeb.CoreComponents do
  use Phoenix.Component
  alias RoundestPhoenix.Pokemons.Pokemon

  attr :entry, Pokemon, required: true

  def fighter(assigns) do
    ~H"""
    <div class="flex flex-col gap-4">
      <img
        src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/#{@entry.dex_id}.png"}
        alt={"#{@entry.name}"}
        class="w-48 h-48"
        style="image-rendering: pixelated;"
      />
      <div class="text-center">
        <span class="text-gray-500 text-lg">#<%= @entry.dex_id %></span>
        <h2 class="text-2xl font-bold capitalize"><%= @entry.name %></h2>
      </div>
      <.vote_button id={@entry.id} />
    </div>
    """
  end

  attr :entry, Pokemon, required: true

  def preload_image(assigns) do
    ~H"""
    <img
      src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/#{@entry.dex_id}.png"}
      class="hidden w-0 h-0"
    />
    """
  end

  attr :id, :string, required: true

  defp vote_button(assigns) do
    ~H"""
    <button
      class="hover:bg-gray-700 bg-blue-600 text-white px-4 py-2 rounded-md"
      phx-click="vote"
      value={@id}
    >
      Vote
    </button>
    """
  end
end
