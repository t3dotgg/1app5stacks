namespace FSharpFunBlazor.Db

open System

[<CLIMutable>]
type Pokemon = {
    Id: int
    Name: string
    UpVotes: int
    DownVotes: int
    DexId: int
    InsertedAt: DateTime
    UpdatedAt: DateTime
}
