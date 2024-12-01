
> This project is using sqlite, it will be auto created and migrated

> Will fetch pokemon with the background service

> It is using server side mode (by WebSocket, so I no need to expose any api for the frontend), but it can also use WASM mode, SSR + HTMX, or even mix any of them if necessary depends on the real use cases: https://slaveoftime.github.io/Fun.Blazor.Docs/


## Run by docker-compose

```bash
docker-compose up
```

Then open http://localhost:5032


## Run as a dev

### Prerequists

Download and install dotnet 9 SDK: https://dotnet.microsoft.com/en-us/download/dotnet/9.0

Check dotnet installation:

```bash
dotnet --version
```


Open this vscode from the same folder as the REAME.md

Run the application:

```
dotnet fsi build.fsx -- -p dev
```

> In case browser did not open the site automatically, please try: http://localhost:5031
