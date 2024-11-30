[<AutoOpen>]
module FSharpFunBlazor.View.Pages.ResultsPage

open System
open Microsoft.AspNetCore.Components.Web
open Fun.Result
open Fun.Blazor
open FSharpFunBlazor.Db


let private pokemonRow (pokemon: Pokemon) index (winPercentage: float) = div {
    key pokemon.DexId
    class' "flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow hover:shadow-md transition-shadow"
    div {
        class' "text-2xl font-bold text-gray-400 w-8"
        $"#{index + 1}"
    }
    img {
        src $"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemon.DexId}.png"
        class' "w-20 h-20"
    }
    div {
        class' "flex-grow"
        div {
            class' "text-gray-400 text-sm"
            $"#{pokemon.DexId}"
        }
        h2 {
            class' "text-xl font-semibold capitalize"
            pokemon.Name
        }
    }
    div {
        class' "text-right"
        div {
            class' "text-2xl font-bold text-blue-400"
            winPercentage
            "%"
        }
        div {
            class' "text-sm text-gray-400"
            $"{pokemon.UpVotes}W - {pokemon.DownVotes}L"
        }
    }
}

let private pokemonsRows =
    html.inject (fun (pokemonService: PokemonService) -> adapt {
        match! pokemonService.GetAll() |> Task.map LoadingState.Loaded |> AVal.ofTask LoadingState.Loading with
        | LoadingState.Loaded pokemons ->
            let totalVotes = pokemons |> Seq.sumBy (fun pokemon -> pokemon.UpVotes + pokemon.DownVotes)

            let calculatedItems =
                pokemons
                |> Seq.map (fun pokemon ->
                    let winPercentage =
                        match totalVotes with
                        | 0 -> 0.
                        | _ -> Math.Round(float pokemon.UpVotes / float totalVotes * 100. * 100.) / 100.
                    pokemon, winPercentage
                )
                |> Seq.sortByDescending snd
                |> Seq.indexed

            for index, (pokemon, winPercentage) in calculatedItems do
                pokemonRow pokemon index winPercentage

        | LoadingState.NotStartYet -> p {
            class' "text-yellow-600 text-center"
            "No pokmons found, please refresh later"
          }

        | _ -> p { "Loading ..." }
    })


let resultsPage = fragment {
    PageTitle'' { "Results" }
    div {
        class' "container mx-auto px-4 py-8 text-white"
        div {
            class' "grid gap-4"
            pokemonsRows
        }
    }
}
