#nowarn "0020"

open System
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.DependencyInjection
open FSharpFunBlazor.Db
open FSharpFunBlazor.View


let builder = WebApplication.CreateBuilder(Environment.GetCommandLineArgs())
let services = builder.Services


services.AddRazorComponents().AddInteractiveServerComponents()
    
services.AddFunBlazorServer()

services.AddTransient<PokemonService>()
services.AddHostedService<PokemonFetchingBackgroundService>()


let app = builder.Build()

app.UseStaticFiles()

app.MapRazorComponents().AddInteractiveServerRenderMode()
app.MapFunBlazor(fun _ -> entry)

app.Run()
