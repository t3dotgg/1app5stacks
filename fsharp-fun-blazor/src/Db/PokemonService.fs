namespace FSharpFunBlazor.Db

open Microsoft.Extensions.Logging
open Microsoft.Extensions.Configuration
open Microsoft.Data.Sqlite
open Dapper
open Fun.Result


type PokemonService(config: IConfiguration, logger: ILogger<PokemonService>) =
    let connectionStr = config.GetConnectionString("Pokemon")

    member _.GetRandomTwo() = task {
        use connection = new SqliteConnection(connectionStr)
        let! results = connection.QueryAsync<Pokemon>("SELECT * FROM pokemon ORDER BY RANDOM() LIMIT 2") |> Task.map Seq.toList
        match results with
        | [ x; y ] -> return Some(x, y)
        | _ -> return None
    }

    member _.GetAll() = task {
        use connection = new SqliteConnection(connectionStr)
        return! connection.QueryAsync<Pokemon>("SELECT * FROM pokemon ORDER BY RANDOM()")
    }

    member _.Vote(upVoteId: int, downVoteId: int) = task {
        use connection = new SqliteConnection(connectionStr)
        connection.Open()

        use transaction = connection.BeginTransaction()

        let! result1 =
            connection.ExecuteAsync(
                "UPDATE pokemon SET UpVotes = UpVotes + 1, UpdatedAt = CURRENT_TIMESTAMP WHERE Id = @upVoteId",
                {| upVoteId = upVoteId |}
            )

        let! result2 =
            connection.ExecuteAsync(
                "UPDATE pokemon SET DownVotes = DownVotes + 1, UpdatedAt = CURRENT_TIMESTAMP WHERE Id = @downVoteId",
                {| downVoteId = downVoteId |}
            )

        if result1 = 1 && result2 = 1 then
            transaction.Commit()
            return Ok()
        else
            logger.LogError("Vote failed")
            return Error "Vote failed"
    }
