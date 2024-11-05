defmodule RoundestPhoenix.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      RoundestPhoenixWeb.Telemetry,
      RoundestPhoenix.Repo,
      {DNSCluster, query: Application.get_env(:roundest_phoenix, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: RoundestPhoenix.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: RoundestPhoenix.Finch},
      # Start a worker by calling: RoundestPhoenix.Worker.start_link(arg)
      # {RoundestPhoenix.Worker, arg},
      # Start to serve requests, typically the last entry
      RoundestPhoenixWeb.Endpoint,
      # cache
      {Cachex, name: :pokemon_cache}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: RoundestPhoenix.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    RoundestPhoenixWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
