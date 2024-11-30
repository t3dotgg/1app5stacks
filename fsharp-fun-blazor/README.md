## Prerequists

Download and install dotnet 9 SDK: https://dotnet.microsoft.com/en-us/download/dotnet/9.0

Check dotnet installation:

```bash
dotnet --version
```

## Dev

Open this vscode from the same folder as the REAME.md

Run the application:

```
dotnet fsi build.fsx -- -p dev
```

> In case browser did not open the site, please try: http://localhost:5031

> This project is using sqlite, it will be auto created and migrated

> Will fetch pokemon with the background service

> It is using server side mode (so I no need to expose any api for the frontend), but it can also use WASM mode, SSR + HTMX, or even mix any of them if necessary depends on the real use cases: https://slaveoftime.github.io/Fun.Blazor.Docs/
