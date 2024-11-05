defmodule RoundestPhoenix.Pokemon do
  use Ecto.Schema
  import Ecto.Changeset

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
end
