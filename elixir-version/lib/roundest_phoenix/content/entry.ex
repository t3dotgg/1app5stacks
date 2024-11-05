defmodule RoundestPhoenix.Content.Entry do
  use Ecto.Schema
  import Ecto.Changeset

  schema "entries" do
    field :url, :string
    field :up_vote, :integer, default: 0
    field :down_vote, :integer, default: 0

    timestamps()
  end

  @doc false
  def changeset(entry, attrs) do
    entry
    |> cast(attrs, [:url, :up_vote, :down_vote])
    |> validate_required([:url])
    |> validate_number(:up_vote, greater_than_or_equal_to: 0)
    |> validate_number(:down_vote, greater_than_or_equal_to: 0)
  end
end
