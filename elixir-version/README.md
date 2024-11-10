# Roundest (Elixir/Phoenix Version)

## Setup

To start your Phoenix server:

- Run `mix setup` to install and setup dependencies
- Start Phoenix endpoint with `mix phx.server` or inside IEx with `iex -S mix phx.server`

## Deploy on Fly

0. Run `fly launch`
1. Once deployed, seed db by running `fly ssh console -C "./bin/roundest_phoenix eval 'RoundestPhoenix.GlobalSetup.run_seed'"`
