[<AutoOpen>]
module FSharpFunBlazor.View.Pages.VotePage

open System.Threading.Tasks
open Microsoft.AspNetCore.Components.Web
open Fun.Result
open Fun.Blazor
open FSharpFunBlazor.Db


let private pokemonCard (pokemon: Pokemon) (onVote: unit -> Task<unit>) = div {
    key pokemon.DexId
    class' "flex flex-col items-center gap-4"
    img {
        src $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemon.DexId}.png"
        class' "w-64 h-64"
        style { "image-rendering", "pixelated" }
    }
    div {
        class' "text-center"
        span {
            class' "text-gray-500 text-lg"
            $"#{pokemon.DexId}"
        }
        h2 {
            class' "text-2xl font-bold capitalize"
            pokemon.Name
        }
        button {
            class' "px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
            onclick (ignore >> onVote)
            "Vote"
        }
    }
}


let private pokemonVoter =
    html.inject (fun (hook: IComponentHook, store: IShareStore, pokemonService: PokemonService) ->
        let pokemons = store.CreateCVal("pokemons", LoadingState<Pokemon * Pokemon>.Loading)


        let loadPokemons () =
            pokemons.Publish LoadingState.start

            pokemonService.GetRandomTwo()
            |> Task.map (
                function
                | Some x -> LoadingState.Loaded x
                | None -> LoadingState.NotStartYet
            )
            |> Task.map pokemons.Publish


        let vote upVoteId downVoteId = task {
            let! result = pokemonService.Vote(upVoteId, downVoteId)
            do! loadPokemons ()
        }


        hook.AddInitializedTask(fun _ -> task { if pokemons.Value.Value.IsNone then do! loadPokemons () })

        div {
            class' "flex justify-center gap-16 items-center min-h-[80vh]"
            adapt {
                match! pokemons with
                | LoadingState.Loaded(pokemonOne, pokemonTwo) ->
                    pokemonCard pokemonOne (fun _ -> vote pokemonOne.Id pokemonTwo.Id)
                    pokemonCard pokemonTwo (fun _ -> vote pokemonTwo.Id pokemonOne.Id)

                | LoadingState.NotStartYet -> p {
                    class' "text-yellow-600 text-center"
                    "No pokmons found, please refresh later"
                  }

                | _ -> p { "Loading ..." }
            }
        }
    )


let votePage = fragment {
    PageTitle'' { "Vote" }
    pokemonVoter
}
