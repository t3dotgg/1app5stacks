defmodule RoundestPhoenixWeb.PokeLive do
  use Phoenix.LiveView,
    layout: {RoundestPhoenixWeb.Layouts, :app}

  import Ecto.Query
  alias RoundestPhoenix.Repo
  alias RoundestPhoenix.Pokemon

  def render(assigns) do
    ~H"""
    <div class="w-full grow flex flex-col items-center justify-center gap-8">
      <div class="md:grid grid-cols-2 gap-8">
        <.async_result :let={[firstEntry, secondEntry]} assign={@entries}>
          <:loading>
            <.pokemon_throbber />
            <.pokemon_throbber />
          </:loading>
          <:failed :let={_failure}>Error</:failed>
          <.pokemon pokemon={firstEntry} loser_id={secondEntry.id} />
          <.pokemon pokemon={secondEntry} loser_id={firstEntry.id} />
        </.async_result>
      </div>
    </div>
    """
  end

  defp pokemon_throbber(assigns) do
    ~H"""
    <div class="flex flex-col items-center gap-4">
      <div class="w-48 h-48 bg-gray-800/10 rounded-lg animate-pulse" />
      <div class="text-center space-y-2 flex flex-col items-center justify-center">
        <div class="h-6 w-16 bg-gray-800/10 rounded animate-pulse" />
        <div class="h-8 w-32 bg-gray-800/10 rounded animate-pulse" />
        <div class="h-12 w-24 bg-gray-800/10 rounded animate-pulse" />
      </div>
    </div>
    """
  end

  attr :pokemon, Pokemon, required: true
  attr :loser_id, :string, required: true

  defp pokemon(assigns) do
    ~H"""
    <div class="flex flex-col gap-4">
      <img
        src={"/pokemon/image/#{@pokemon.dex_id}"}
        alt={@pokemon.name}
        class="w-48 h-48"
        style="image-rendering: pixelated;"
      />
      <div class="text-center">
        <span class="text-gray-500 text-lg">#<%= @pokemon.dex_id %></span>
        <h2 class="text-2xl font-bold capitalize"><%= @pokemon.name %></h2>
      </div>
      <button
        class="hover:bg-gray-700 bg-blue-600 text-white px-4 py-2 rounded-md"
        phx-click="vote"
        phx-value-winner_id={@pokemon.id}
        phx-value-loser_id={@loser_id}
      >
        Vote
      </button>
    </div>
    """
  end

  def handle_event("vote", %{"winner_id" => winner_id, "loser_id" => loser_id}, socket) do
    Task.start(fn -> record_vote(winner_id, loser_id) end)
    {:noreply, assign_random_pair(socket)}
  end

  def mount(_params, _session, socket) do
    {:ok, assign_random_pair(socket)}
  end

  defp record_vote(winner_id, loser_id) do
    winner_query = from p in Pokemon, where: p.id == ^winner_id, update: [inc: [up_votes: 1]]
    loser_query = from p in Pokemon, where: p.id == ^loser_id, update: [inc: [down_votes: 1]]

    Repo.transaction(fn ->
      {1, _} = Repo.update_all(winner_query, [])
      {1, _} = Repo.update_all(loser_query, [])
    end)
  end

  defp assign_random_pair(socket) do
    assign_async(socket, [:entries], fn ->
      {:ok, %{entries: get_random_pair()}}
    end)
  end

  defp get_random_pair do
    query =
      from(e in Pokemon,
        order_by: fragment("RANDOM()"),
        limit: 2
      )

    Repo.all(query)
  end
end
