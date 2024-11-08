package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

func InitPokemonSchema(db *sqlx.DB) error {
	schema := `
    CREATE TABLE IF NOT EXISTS pokemon (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dex_id INTEGER NOT NULL,
        up_votes INTEGER DEFAULT 0,
        down_votes INTEGER DEFAULT 0,
        inserted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- Create an index on dex_id since it's likely to be queried
    CREATE INDEX IF NOT EXISTS idx_pokemon_dex_id ON pokemon(dex_id);`

	_, err := db.Exec(schema)
	if err != nil {
		return fmt.Errorf("failed to create pokemon schema: %w", err)
	}

	return nil
}
