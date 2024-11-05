defmodule RoundestPhoenix.Repo.Migrations.CreateEntriesTable do
  use Ecto.Migration

  def change do
    # DEPRECATED, was used during R&D
    create table(:entries) do
      add :url, :string
      add :up_vote, :integer, default: 0
      add :down_vote, :integer, default: 0

      timestamps()
    end
  end
end
