## Roundest Go Backend

### Getting Started

0. Start the local DB instance (or pick another) with `docker compose up -d`
1. Fill the `.env` with your database URL
2. Make sure you have the deps `go mod tidy`
3. Setup the DB (schema and seed) with `go run scripts/setup.go`
4. Run the dev server `go run main.go`

_NOTE: this is not perfect, but it gets the job done_
