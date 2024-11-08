package main

import (
	"fmt"
	"roundest-go/db"
)

func main() {
	conn, err := db.NewConnection()

	if err != nil {
		panic(err)
	}

	defer conn.Close()

	fmt.Println("Connected to database")

	fmt.Println("Creating pokemon schema...")

	if err := db.InitPokemonSchema(conn); err != nil {
		panic(err)
	}

	fmt.Println("Seeding pokemon...")

	if err := db.SeedPokemon(conn); err != nil {
		panic(err)
	}
}
