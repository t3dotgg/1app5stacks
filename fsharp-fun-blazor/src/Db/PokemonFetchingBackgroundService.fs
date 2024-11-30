namespace FSharpFunBlazor.Db

open System.Reflection
open FSharp.Control
open Microsoft.Data.Sqlite
open Microsoft.Extensions.Logging
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Configuration
open DbUp
open Dapper

type PokemonFetchingBackgroundService(config: IConfiguration, logger: ILogger<PokemonFetchingBackgroundService>) =
    inherit BackgroundService()

    override _.ExecuteAsync(cancellationToken) = task {
        logger.LogInformation "Start migration"

        let connectionStr = config.GetConnectionString("Pokemon")

        let migrationResult =
            DeployChanges.To
                .SQLiteDatabase(connectionStr)
                .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
                .LogToConsole()
                .Build()
                .PerformUpgrade()

        if migrationResult.Error <> null || not migrationResult.Successful then
            logger.LogError(migrationResult.Error, "Migration failed")
            raise migrationResult.Error


        logger.LogInformation "Fetch and save pokemon"

        use pokeApi = new PokeApiNet.PokeApiClient()
        use connection = new SqliteConnection(connectionStr)

        for resource in pokeApi.GetAllNamedResourcesAsync<PokeApiNet.Pokemon>(cancellationToken) do
            let! pokemon = pokeApi.GetResourceAsync<PokeApiNet.Pokemon>(resource.Name, cancellationToken = cancellationToken)

            let! isInserted =
                connection.ExecuteScalarAsync<bool>("SELECT COUNT(DISTINCT 1) FROM pokemon WHERE DexID = @DexID", {| DexID = pokemon.Id |})

            if not isInserted then
                logger.LogInformation("Insert pokemon {name}", resource.Name)

                let! result =
                    connection.ExecuteAsync(
                        """
                        INSERT INTO pokemon (Name, DexId)
                        VALUES (@Name, @DexId) 
                        """,
                        {| Name = pokemon.Name; DexId = pokemon.Id |}
                    )

                if result <> 1 then
                    logger.LogError("Insert pokemon {name} failed", resource.Name)
    }
