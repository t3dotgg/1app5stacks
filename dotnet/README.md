# Blazor pokemon battle app

I saw Theo's video on 1 app with 5 stacks and decided to add one more. I was very disappointed in other stacks - they seemed so complicated.

Behold: C# and Blazor!

## How to run

Just run `docker-compose up` in this directory - it will spin up a postgres database and a web server.

Then just open http://localhost:8081 in your browser.

## A bit about the code

### Database

I am using Entity Framework Core with SQLite and Postgres. As you can see, it's extremely easy to switch between them. The same query and insert code works for both.

Just change `DatabaseTech` in appsettings.json to `Sqlite` or `Postgres`, and adjust the conenction string for postgres if needed.

### Seeding

I use a hosted service to seed the database and run the migrations. In real app in production migrations are run with a special container that EF Core can generate.

Seeding is implemented with channels - pretty cool stuff, as you can see not only Go can do that.

### UI

I am using Blazor Server, which is very similar to Phoenix LiveView. Every browser tab is a separate WebSocket connection, the server holds the state of the app in memory and sends it to the client when it changes.

As you can see, we can use the `PokemonDbContext` directly in the component code, which paired with [QuickGrid](https://aspnet.github.io/quickgridsamples/) gives you an extremely easy way to display data. It uses virtualization, so no need for pagination, as it is passing offset and limit to the query as you scroll.

I am also extremely bad with css, so there is none.

### API

In `Program.cs` you can see there is also and endpoint `/seed` that you can call with postman or curl. I just wanted to show how easy it is to add one.

## Key takeaways

- same tech for frontend and backend
- not that many files/lines of code
- server runs with 50MB of ram in Docker - pretty decent
- EF Core is THE BEST ORM out there, and I will die on that hill


