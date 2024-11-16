defmodule RoundestPhoenixWeb.PokeLive do
  use RoundestPhoenixWeb, :live_view

  import Ecto.Query
  alias RoundestPhoenix.Repo
  alias RoundestPhoenix.Pokemon

  def render(%{page: "loading"} = assigns) do
    ~H"""
    <div class="w-full grow flex flex-col items-center justify-center gap-8">
      <div class="md:grid grid-cols-2 gap-8">
        <div class="flex flex-col items-center gap-4">
          <div class="w-48 h-48 bg-gray-800/10 rounded-lg animate-pulse" />
          <div class="text-center space-y-2 flex flex-col items-center justify-center">
            <div class="h-6 w-16 bg-gray-800/10 rounded animate-pulse" />
            <div class="h-8 w-32 bg-gray-800/10 rounded animate-pulse" />
            <div class="h-12 w-24 bg-gray-800/10 rounded animate-pulse" />
          </div>
        </div>

        <div class="flex flex-col items-center gap-4">
          <div class="w-48 h-48 bg-gray-800/10 rounded-lg animate-pulse" />
          <div class="text-center space-y-2 flex flex-col items-center justify-center">
            <div class="h-6 w-16 bg-gray-800/10 rounded animate-pulse" />
            <div class="h-8 w-32 bg-gray-800/10 rounded animate-pulse" />
            <div class="h-12 w-24 bg-gray-800/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
    """
  end

  def render(assigns) do
    ~H"""
    <div class="w-full grow flex flex-col items-center justify-center gap-8">
      <div class="md:grid grid-cols-2 gap-8">
        <div class="flex flex-col gap-4">
          <img
            src={"/images/#{@firstEntry.dex_id}.png"}
            alt={"#{@firstEntry.name}"}
            class="w-48 h-48"
            style="image-rendering: pixelated;"
          />
          <div class="text-center">
            <span class="text-gray-500 text-lg">#<%= @firstEntry.dex_id %></span>
            <h2 class="text-2xl font-bold capitalize"><%= @firstEntry.name %></h2>
          </div>
          <button
            class="hover:bg-gray-700 bg-blue-600 text-white px-4 py-2 rounded-md"
            phx-click="vote"
            phx-value-winner_id={@firstEntry.id}
          >
            Vote
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <img
            src={"/images/#{@secondEntry.dex_id}.png"}
            alt={"#{@secondEntry.name}"}
            class="w-48 h-48"
            style="image-rendering: pixelated;"
          />
          <div class="text-center">
            <span class="text-gray-500 text-lg">#<%= @secondEntry.dex_id %></span>
            <h2 class="text-2xl font-bold capitalize"><%= @secondEntry.name %></h2>
          </div>
          <button
            class="hover:bg-gray-700 bg-blue-600 text-white px-4 py-2 rounded-md"
            phx-click="vote"
            phx-value-winner_id={@secondEntry.id}
          >
            Vote
          </button>
        </div>
      </div>
    </div>
    """
  end

  def handle_event("vote", %{"winner_id" => winner_id}, socket) do
    [winner, loser] = cond do
      winner_id == to_string(socket.assigns.firstEntry.id) -> [socket.assigns.firstEntry, socket.assigns.secondEntry]
      winner_id == to_string(socket.assigns.secondEntry.id) -> [socket.assigns.secondEntry, socket.assigns.firstEntry]
      true -> raise "Invalid winner id"
    end

    Task.start(fn -> Pokemon.record_vote(winner.id, loser.id) end)

    [nextFirstEntry, nextSecondEntry] = get_random_pair()

    {:noreply,
     socket
     |> assign(:firstEntry, nextFirstEntry)
     |> assign(:secondEntry, nextSecondEntry)}
  end

  # tragic: https://kobrakai.de/kolumne/liveview-double-mount
  def mount(_params, _session, socket) do
    case connected?(socket) do
      true ->
        [firstEntry, secondEntry] = get_random_pair()

        {:ok,
         socket
         |> assign(:firstEntry, firstEntry)
         |> assign(:secondEntry, secondEntry)}

      false ->
        {:ok, assign(socket, page: "loading")}
    end
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
