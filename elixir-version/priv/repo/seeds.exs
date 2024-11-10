# Make sure Mix is available and the application is started
Mix.start()
# Start the applications we need
Application.ensure_all_started(:httpoison)

RoundestPhoenix.GlobalSetup.run_seed()
