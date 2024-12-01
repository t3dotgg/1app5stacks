[<AutoOpen>]
module FSharpFunBlazor.View.Pages.ResultsPage

open System
open Microsoft.AspNetCore.Components.Web
open Microsoft.AspNetCore.Components.Web.Virtualization
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


let private pokemonsLoader = div {
    class' "grid gap-4"
    for i in 1..10 do
        div {
            key i
            class' "flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow animate-pulse"
            div { class' "w-8 h-8 bg-gray-700/40 rounded" }
            div { class' "w-20 h-20 bg-gray-700/40 rounded" }
            div {
                class' "flex-grow"
                div { class' "w-16 h-4 bg-gray-700/40 rounded mb-2" }
                div { class' "w-32 h-6 bg-gray-700/40 rounded" }
            }
            div {
                class' "text-right"
                div { class' "w-16 h-8 bg-gray-700/40 rounded mb-2" }
                div { class' "w-24 h-4 bg-gray-700/40 rounded" }
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
                |> Collections.Generic.List

            Virtualize'' {
                Items calculatedItems
                ChildContent(fun (index, (pokemon, winPercentage)) -> pokemonRow pokemon index winPercentage)
            }

        | LoadingState.NotStartYet -> p {
            class' "text-yellow-600 text-center"
            "No pokmons found, please refresh later"
          }

        | _ -> pokemonsLoader
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
