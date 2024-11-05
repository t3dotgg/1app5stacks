defmodule RoundestPhoenix.Repo do
  use Ecto.Repo,
    otp_app: :roundest_phoenix,
    adapter: Ecto.Adapters.Postgres
end
