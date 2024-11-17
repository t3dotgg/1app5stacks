defmodule RoundestPhoenix.Pokemons do
  import Ecto.Query
  alias RoundestPhoenix.Repo
  alias RoundestPhoenix.Pokemons.Pokemon

  def vote(id, first, second) do
    {winner, loser} =
      if id == first.id do
        {first, second}
      else
        {second, first}
      end

    IO.puts(winner.name)

    Ecto.Multi.new()
    |> Ecto.Multi.update(
      :update_winner,
      Ecto.Changeset.change(winner, %{up_votes: winner.up_votes + 1})
    )
    |> Ecto.Multi.update(
      :update_loser,
      Ecto.Changeset.change(loser, %{down_votes: loser.down_votes + 1})
    )
    |> Repo.transaction()
    |> case do
      {:ok, _result} ->
        :ok

      {:error, _step, _changeset, _changes} ->
        :error
    end
  end

  def get_random_pokemons(keys) do
    limit = Enum.count(keys)

    results =
      from(p in Pokemon,
        order_by: fragment("RANDOM()"),
        limit: ^limit
      )
      |> Repo.all()

    keys
    |> Enum.zip(results)
    |> Enum.into(%{})
  end

  def get_pokemon_by_win_rate do
    from(p in Pokemon,
      where: p.up_votes > 0 or p.down_votes > 0,
      select: %{
        name: p.name,
        dex_id: p.dex_id,
        up_votes: p.up_votes,
        down_votes: p.down_votes,
        total_votes: p.up_votes + p.down_votes,
        win_percentage:
          fragment(
            "ROUND((?::numeric / (? + ?)::numeric) * 100, 2)::double precision",
            p.up_votes,
            p.up_votes,
            p.down_votes
          ),
        loss_percentage:
          fragment(
            "ROUND((?::numeric / (? + ?)::numeric) * 100, 2)::double precision",
            p.down_votes,
            p.up_votes,
            p.down_votes
          )
      },
      order_by: [
        desc:
          fragment(
            "ROUND((?::numeric / (? + ?)::numeric) * 100, 2)::double precision",
            p.up_votes,
            p.up_votes,
            p.down_votes
          ),
        desc: p.up_votes
      ]
    )
    |> Repo.all()
  end
end
