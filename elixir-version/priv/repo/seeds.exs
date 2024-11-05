# Make sure Mix is available and the application is started
Mix.start()
# Start the applications we need
Application.ensure_all_started(:httpoison)

alias RoundestPhoenix.Repo
alias RoundestPhoenix.Pokemon

# Start your application (this will start Ecto and other dependencies)
Application.ensure_all_started(:roundest_phoenix)

defmodule PokemonSeeder do
  @graphql_url "https://beta.pokeapi.co/graphql/v1beta"
  @query """
  query GetAllPokemon {
    pokemon_v2_pokemon(where: {id: {_lte: 1025}}) {
      id
      pokemon_v2_pokemonspecy {
        name
      }
    }
  }
  """

  def fetch_all_pokemon do
    headers = [{"Content-Type", "application/json"}]
    body = Jason.encode!(%{query: @query})

    case HTTPoison.post(@graphql_url, body, headers) do
      {:ok, %HTTPoison.Response{status_code: 200, body: response_body}} ->
        case Jason.decode(response_body) do
          {:ok, %{"data" => data}} ->
            {:ok, data["pokemon_v2_pokemon"]}

          {:error, error} ->
            {:error, "Failed to decode JSON: #{inspect(error)}"}
        end

      {:ok, %HTTPoison.Response{status_code: status_code}} ->
        {:error, "Request failed with status code: #{status_code}"}

      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, "HTTP request failed: #{inspect(reason)}"}
    end
  end

  def get_pokemon_names do
    case fetch_all_pokemon() do
      {:ok, pokemon_list} ->
        pokemon_data =
          pokemon_list
          |> Enum.filter(fn pokemon -> pokemon["id"] <= 1025 end)
          |> Enum.map(fn pokemon ->
            %{
              id: pokemon["id"],
              name: pokemon["pokemon_v2_pokemonspecy"]["name"]
            }
          end)

        {:ok, pokemon_data}

      error ->
        error
    end
  end
end

# Clear existing Pokemon
IO.puts("Clearing existing Pokemon...")
Repo.delete_all(Pokemon)

# Fetch and insert new Pokemon
IO.puts("Fetching Pokemon data...")

case PokemonSeeder.get_pokemon_names() do
  {:ok, pokemon_list} ->
    IO.puts("Inserting #{length(pokemon_list)} Pokemon...")

    Enum.each(pokemon_list, fn pokemon_data ->
      %Pokemon{}
      |> Pokemon.changeset(%{
        name: pokemon_data.name,
        dex_id: pokemon_data.id,
        up_votes: 0,
        down_votes: 0
      })
      |> Repo.insert!()

      IO.puts("Inserted Pokemon: #{pokemon_data.name}")
    end)

    IO.puts("Seeding completed successfully!")

  {:error, error} ->
    IO.puts("Error during seeding: #{inspect(error)}")
end
