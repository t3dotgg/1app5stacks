defmodule RoundestPhoenix.Pokemon do
  use Ecto.Schema
  import Ecto.Changeset
  alias RoundestPhoenix.Repo

  schema "pokemon" do
    field :name, :string
    field :dex_id, :integer
    field :up_votes, :integer
    field :down_votes, :integer

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(pokemon, attrs) do
    pokemon
    |> cast(attrs, [:name, :dex_id, :up_votes, :down_votes])
    |> validate_required([:name, :dex_id, :up_votes, :down_votes])
  end

  def record_vote(winner_id, loser_id) do
    Ecto.Multi.new()
    |> Ecto.Multi.run(:winner, fn repo, _ ->
      case repo.get(RoundestPhoenix.Pokemon, winner_id) do
        nil -> {:error, :not_found}
        pokemon -> {:ok, pokemon}
      end
    end)
    |> Ecto.Multi.run(:loser, fn repo, _ ->
      case repo.get(RoundestPhoenix.Pokemon, loser_id) do
        nil -> {:error, :not_found}
        pokemon -> {:ok, pokemon}
      end
    end)
    |> Ecto.Multi.update(:update_winner, fn %{winner: winner} ->
      winner |> Ecto.Changeset.change(%{up_votes: winner.up_votes + 1})
    end)
    |> Ecto.Multi.update(:update_loser, fn %{loser: loser} ->
      loser |> Ecto.Changeset.change(%{down_votes: loser.down_votes + 1})
    end)
    |> Repo.transaction()
  end
end
