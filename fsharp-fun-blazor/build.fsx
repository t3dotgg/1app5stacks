#r "nuget: Fun.Build"

open Fun.Result
open Fun.Build

pipeline "dev" {
    stage "start" {
        paralle
        run "npx tailwindcss -i ./tailwind.css -o ./src/wwwroot/index.css -w -p"
        run "dotnet watch run --no-hot-reload --project ./src/FSharpFunBlazor.fsproj --urls=http://localhost:5031"
        run (fun ctx -> asyncResult {
            do! Async.Sleep 10_000 |> Async.map Ok
            do! ctx.OpenBrowser "http://localhost:5031"
        })
    }
    runIfOnlySpecified false
}

tryPrintPipelineCommandHelp ()
