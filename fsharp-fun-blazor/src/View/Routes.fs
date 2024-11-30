namespace FSharpFunBlazor.View

open Microsoft.AspNetCore.Components.Web
open Fun.Blazor
open Fun.Blazor.Router
open FSharpFunBlazor.View.Pages

type Routes() =
    inherit FunComponent()

    override _.Render() = html.route [ 
        routeCi "/" votePage
        routeCi "/results" resultsPage
    ]
