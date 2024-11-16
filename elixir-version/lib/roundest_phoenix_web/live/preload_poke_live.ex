defmodule RoundestPhoenixWeb.PRELOADPokeLive do
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
            src={~p"/images/#{to_string(@firstEntry.dex_id) <> ".png"}"}
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
            phx-value-loser_id={@secondEntry.id}
          >
            Vote
          </button>
        </div>

        <div class="flex flex-col gap-4">
          <img
            src={~p"/images/#{to_string(@secondEntry.dex_id) <> ".png"}"}
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
            phx-value-loser_id={@firstEntry.id}
          >
            Vote
          </button>
        </div>
      </div>
       <%!-- Hidden images to preload --%>
      <div class="hidden" :for={pokeId <- @needs_preload |> Enum.take(10) }>
        <link id={"preload-#{pokeId}"} phx-hook="RemoveAfterLoad" rel="preload" href={~p"/images/#{to_string(pokeId) <> ".png"}"} as="image" />
      </div>
    </div>
    """
  end
  def handle_event("preload-done", %{"id" => id}, socket) do
    needs_preload = socket.assigns.needs_preload |> MapSet.delete(id)
    {:noreply, assign(socket, needs_preload: needs_preload)}
  end

  def handle_event("vote", %{"winner_id" => winner_id, "loser_id" => loser_id}, socket) do
    Task.start(fn -> record_vote(socket, winner_id, loser_id) |> IO.inspect() end)

    [firstEntry, secondEntry] = get_random_pair(socket.assigns.all_pokeids)

    {:noreply,
      socket
      |> assign(:firstEntry, firstEntry)
      |> assign(:secondEntry, secondEntry)
  }
  end

  # tragic: https://kobrakai.de/kolumne/liveview-double-mount
  def mount(_params, _session, socket) do
    all_pokeids = get_all_ids()

    case connected?(socket) do
      true ->
        [firstEntry, secondEntry] = get_random_pair(all_pokeids)

        {:ok,
         socket
         |> assign(:firstEntry, firstEntry)
         |> assign(:secondEntry, secondEntry)
         |> assign(:all_pokeids, all_pokeids)
         |> assign(:needs_preload, all_pokeids)}


      false ->
        {:ok, assign(socket, page: "loading", all_pokeids: all_pokeids, needs_preload: [])}
    end
  end

  defp record_vote(socket, winner_id, loser_id) do
    firstEntry = socket.assigns.firstEntry
    secondEntry = socket.assigns.secondEntry

    winner =
      case firstEntry.id == winner_id do
        true -> secondEntry
        false -> firstEntry
      end

    loser =
      case firstEntry.id == loser_id do
        true -> secondEntry
        false -> firstEntry
      end

    IO.puts(winner.name)

    Repo.transaction(fn ->
      case winner |> Ecto.Changeset.change(%{up_votes: winner.up_votes + 1}) |> Repo.update() do
        {:ok, _winner} ->
          case loser
               |> Ecto.Changeset.change(%{down_votes: loser.down_votes + 1})
               |> Repo.update() do
            {:ok, _loser} -> :ok
            {:error, _} -> Repo.rollback(:error)
          end

        {:error, _} ->
          Repo.rollback(:error)
      end
    end)
  end

  defp get_random_pair(all_pokeids) do
    first = Enum.random(all_pokeids)
    second = Enum.random(all_pokeids)

    query =
      from(e in Pokemon,
        where: e.dex_id in ^[first, second],
        limit: 2
      )

    Repo.all(query)
  end

  defp get_all_ids do
    from(e in Pokemon, select: e.dex_id)
    |> Repo.all()
    |> MapSet.new()
  end
end
