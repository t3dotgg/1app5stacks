package main

import (
	"log"
	"math"
	"net/http"
	"roundest-go/db"
	"sort"
	"time"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
	"github.com/rs/cors"
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

type Result struct {
	Name           string  `db:"name" json:"name"`
	ID             int64   `db:"id" json:"id"`
	DexID          int     `db:"dex_id" json:"dexId"`
	UpVotes        int     `db:"up_votes" json:"upVotes"`
	DownVotes      int     `db:"down_votes" json:"downVotes"`
	TotalVotes     int     `db:"total_votes" json:"totalVotes"`
	WinPercentage  float64 `db:"win_percentage" json:"winPercentage"`
	LossPercentage float64 `db:"loss_percentage" json:"lossPercentage"`
}

func main() {
	db, err := db.NewConnection()
	if err != nil {
		log.Fatalf("Could not connect to database: %v", err)
	}
	defer db.Close()

	pokemonType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Pokemon",
		Fields: graphql.Fields{
			"id":        &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"name":      &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"dexId":     &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"upVotes":   &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"downVotes": &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
		},
	})

	resultType := graphql.NewObject(graphql.ObjectConfig{
		Name: "Result",
		Fields: graphql.Fields{
			"name": &graphql.Field{Type: graphql.NewNonNull(graphql.String)},
			"id":   &graphql.Field{Type: graphql.NewNonNull(graphql.Int)},
			"dexId": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"upVotes": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"downVotes": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"totalVotes": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Int),
			},
			"winPercentage": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Float),
			},
			"lossPercentage": &graphql.Field{
				Type: graphql.NewNonNull(graphql.Float),
			},
		},
	})

	// Definite mutations
	mutations := graphql.Fields{
		"vote": &graphql.Field{
			Type: graphql.NewObject(graphql.ObjectConfig{
				Name: "VoteResult",
				Fields: graphql.Fields{
					"success": &graphql.Field{Type: graphql.Boolean},
				},
			}),
			Args: graphql.FieldConfigArgument{
				"upvoteId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
				"downvoteId": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.Int),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				upvoteId := p.Args["upvoteId"].(int)
				downvoteId := p.Args["downvoteId"].(int)

				tx, err := db.Begin()
				if err != nil {
					return nil, err
				}
				defer tx.Rollback()

				_, err = tx.Exec(`
                    UPDATE pokemon 
					SET up_votes = up_votes + 1
                    WHERE id = $1;
                `, upvoteId)
				if err != nil {
					return nil, err
				}

				_, err = tx.Exec(`
                    UPDATE pokemon 
					SET down_votes = down_votes + 1
                    WHERE id = $1;
                `, downvoteId)
				if err != nil {
					return nil, err
				}

				err = tx.Commit()
				if err != nil {
					return nil, err
				}

				return map[string]interface{}{
					"success": true,
				}, nil
			},
		},
	}

	// Define query
	fields := graphql.Fields{
		"pokemon": &graphql.Field{
			Type: graphql.NewList(pokemonType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var pokemon []Pokemon
				err := db.Select(&pokemon, "SELECT name, id, up_votes, down_votes, inserted_at, updated_at FROM pokemon WHERE id < 1025 ORDER BY up_votes DESC")
				if err != nil {
					return nil, err
				}
				return pokemon, nil
			},
		},
		"results": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(resultType))),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var pokemon []Pokemon
				err := db.Select(&pokemon, "SELECT name, id, dex_id, up_votes, down_votes FROM pokemon WHERE id < 1025 ORDER BY up_votes DESC")
				if err != nil {
					return []Result{}, err
				}

				results := make([]Result, len(pokemon))

				for i, pokemon := range pokemon {
					totalVotes := pokemon.UpVotes + pokemon.DownVotes
					var winPercentage, lossPercentage float64

					if totalVotes > 0 {
						winPercentage = math.Round((float64(pokemon.UpVotes)/float64(totalVotes)*100)*100) / 100
						lossPercentage = math.Round((float64(pokemon.DownVotes)/float64(totalVotes)*100)*100) / 100
					}

					results[i] = Result{
						Name:           pokemon.Name,
						ID:             pokemon.ID,
						DexID:          pokemon.DexID,
						UpVotes:        pokemon.UpVotes,
						DownVotes:      pokemon.DownVotes,
						TotalVotes:     totalVotes,
						WinPercentage:  winPercentage,
						LossPercentage: lossPercentage,
					}
				}

				sort.Slice(results, func(i, j int) bool {
					// If win percentages are equal
					if results[i].WinPercentage == results[j].WinPercentage {
						return results[i].UpVotes > results[j].UpVotes
					}

					// Sort by win percentage (higher percentage first)
					return results[i].WinPercentage > results[j].WinPercentage
				})

				return results, nil
			},
		},
		"randomPair": &graphql.Field{
			Type: graphql.NewObject(graphql.ObjectConfig{
				Name: "RandomPair",
				Fields: graphql.Fields{
					"pokemonOne": &graphql.Field{Type: graphql.NewNonNull(pokemonType)},
					"pokemonTwo": &graphql.Field{Type: graphql.NewNonNull(pokemonType)},
				},
			}),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				var pokemon []Pokemon

				err := db.Select(&pokemon, `
				SELECT name, id, dex_id, up_votes, down_votes, inserted_at, updated_at FROM pokemon
                    WHERE id < 1025 ORDER BY RANDOM() 
                    LIMIT 2
                `)
				if err != nil {
					return nil, err
				}

				if len(pokemon) < 2 {
					return nil, nil
				}

				return map[string]interface{}{
					"pokemonOne": pokemon[0],
					"pokemonTwo": pokemon[1],
				}, nil
			},
		},
	}

	rootQuery := graphql.ObjectConfig{
		Name:   "RootQuery",
		Fields: fields,
	}

	schemaConfig := graphql.SchemaConfig{
		Query: graphql.NewObject(rootQuery),
		Mutation: graphql.NewObject(graphql.ObjectConfig{
			Name:   "Mutation",
			Fields: mutations,
		}),
	}

	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("Failed to create schema: %v", err)
	}

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	})

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
		Debug:          true,
	})

	handler := c.Handler(h)

	// Start server
	http.Handle("/graphql", handler)
	log.Println("Server is running on http://localhost:8080/graphql")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
