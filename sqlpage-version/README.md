# Roundest (SQLPage Version)

This is a simple web app that allows you to vote on which Pokemon is the most round.

It's built with [SQLPage](https://sql-page.com),
a tool for turning SQL queries into web apps.

## Running the app

```
docker build -t roundest-sqlpage .
docker run -p 8080:8080 -it roundest-sqlpage
```
