defmodule RoundestPhoenixWeb.PokemonController do
  use RoundestPhoenixWeb, :controller
  import Ecto.Query
  alias RoundestPhoenix.Repo
  alias RoundestPhoenix.Pokemon

  @cache_control_header "public, max-age=86400"
  @cache_ttl :timer.hours(24)

  @spec show_results(Plug.Conn.t(), any()) :: Plug.Conn.t()
  def show_results(conn, _params) do
    pokemon = get_pokemon_by_win_rate()
    render(conn, :results, pokemon: pokemon)
  end

  defp get_pokemon_by_win_rate do
    base_query =
      from p in Pokemon,
        where: p.up_votes > 0 or p.down_votes > 0,
        select: %{
          name: p.name,
          dex_id: p.dex_id,
          up_votes: p.up_votes,
          down_votes: p.down_votes
        }

    base_query
    |> Repo.all()
    |> Enum.map(fn pokemon ->
      total_votes = pokemon.up_votes + pokemon.down_votes
      win_percentage = calculate_percentage(pokemon.up_votes, total_votes)
      loss_percentage = calculate_percentage(pokemon.down_votes, total_votes)

      pokemon
      |> Map.put(:total_votes, total_votes)
      |> Map.put(:win_percentage, win_percentage)
      |> Map.put(:loss_percentage, loss_percentage)
    end)
    |> Enum.sort_by(
      fn pokemon ->
        {pokemon.win_percentage, pokemon.up_votes}
      end,
      :desc
    )
  end

  defp calculate_percentage(part, total) when total > 0 do
    percentage = part / total * 100
    Float.round(percentage, 2)
  end

  defp calculate_percentage(_, _), do: 0.0

  def show_image(conn, %{"dex_id" => dex_id}) do
    image_url =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/#{dex_id}.png"

    case get_cached_image(image_url) do
      {:ok, image_binary} ->
        conn
        |> put_resp_header("cache-control", @cache_control_header)
        |> put_resp_content_type("image/png")
        |> send_resp(200, image_binary)

      {:error, _reason} ->
        conn
        |> put_status(404)
        |> text("Pokemon image not found")
    end
  end

  defp get_cached_image(url) do
    case Cachex.get(:pokemon_cache, url) do
      {:ok, nil} ->
        # Cache miss - fetch and cache the image
        case HTTPoison.get(url) do
          {:ok, %{status_code: 200, body: image_binary}} ->
            # Store in cache with TTL
            Cachex.put(:pokemon_cache, url, image_binary, ttl: @cache_ttl)
            {:ok, image_binary}

          _error ->
            {:error, :fetch_failed}
        end

      {:ok, image_binary} ->
        # Cache hit
        {:ok, image_binary}

      {:error, _reason} ->
        {:error, :cache_error}
    end
  end
end
