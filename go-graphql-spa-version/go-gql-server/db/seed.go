package db

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/jmoiron/sqlx"
)

const (
	graphqlURL = "https://beta.pokeapi.co/graphql/v1beta"
	query      = `
	query GetAllPokemon {
		pokemon_v2_pokemon {
			id
			pokemon_v2_pokemonspecy {
				name
			}
		}
	}`
)

type Pokemon struct {
	ID         int64     `db:"id" json:"id"`
	Name       string    `db:"name" json:"name"`
	DexID      int       `db:"dex_id" json:"dexId"`
	UpVotes    int       `db:"up_votes" json:"upVotes"`
	DownVotes  int       `db:"down_votes" json:"downVotes"`
	InsertedAt time.Time `db:"inserted_at" json:"insertedAt"`
	UpdatedAt  time.Time `db:"updated_at" json:"updatedAt"`
}

type GraphQLResponse struct {
	Data struct {
		Pokemon []struct {
			ID           int `json:"id"`
			PokemonSpecy struct {
				Name string `json:"name"`
			} `json:"pokemon_v2_pokemonspecy"`
		} `json:"pokemon_v2_pokemon"`
	} `json:"data"`
}

type PokemonData struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func fetchAllPokemon() ([]PokemonData, error) {
	reqBody := map[string]string{
		"query": query,
	}
	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("error marshaling query: %w", err)
	}

	req, err := http.NewRequest("POST", graphqlURL, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("error making request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("request failed with status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %w", err)
	}

	var graphQLResp GraphQLResponse
	if err := json.Unmarshal(body, &graphQLResp); err != nil {
		return nil, fmt.Errorf("error parsing JSON response: %w", err)
	}

	pokemonList := make([]PokemonData, len(graphQLResp.Data.Pokemon))
	for i, p := range graphQLResp.Data.Pokemon {
		pokemonList[i] = PokemonData{
			ID:   p.ID,
			Name: p.PokemonSpecy.Name,
		}
	}

	return pokemonList, nil
}

func SeedPokemon(db *sqlx.DB) error {
	ctx := context.Background()

	log.Println("Clearing existing Pokemon...")
	_, err := db.ExecContext(ctx, "DELETE FROM pokemon")
	if err != nil {
		return fmt.Errorf("error clearing existing pokemon: %w", err)
	}

	log.Println("Fetching Pokemon data...")
	pokemonList, err := fetchAllPokemon()
	if err != nil {
		return fmt.Errorf("error fetching pokemon: %w", err)
	}

	log.Printf("Inserting %d Pokemon...\n", len(pokemonList))

	query := `
		INSERT INTO pokemon (name, dex_id, up_votes, down_votes, id, inserted_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	`

	for _, pokemon := range pokemonList {
		_, err := db.ExecContext(ctx, query,
			pokemon.Name,
			pokemon.ID,
			0, // up_votes
			0, // down_votes
			pokemon.ID,
		)
		if err != nil {
			return fmt.Errorf("error inserting pokemon %s: %w", pokemon.Name, err)
		}
		log.Printf("Inserted Pokemon: %s\n", pokemon.Name)
	}

	log.Println("Seeding completed successfully!")
	return nil
}
