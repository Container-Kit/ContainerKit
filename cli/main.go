package main

import (
	"fmt"
	"os"

	"github.com/container-kit/cli/cmd"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(".env"); err != nil {
		// Don't exit if .env doesn't exist, just warn
		fmt.Fprintf(os.Stderr, "Warning: .env file not found: %v\n", err)
	}

	// Execute the root command
	if err := cmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
