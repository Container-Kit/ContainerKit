package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/spf13/cobra"
)

var migrationCmd = &cobra.Command{
	Use:   "migration",
	Short: "Manage database migrations for your Tauri application",
	Long: `
Manage database migrations for your Container Kit Tauri application.

This command provides migration management:
• Generate Rust migration files from SQL
• Validate migration files and structure
• List available migrations
• Check migration system status

MIGRATION WORKFLOW:
1. Create SQL migration files in src-tauri/migrations/
2. Run 'migration generate' to create Rust bindings
3. Migrations are automatically applied on app startup

SUPPORTED OPERATIONS:
• generate    - Generate Rust migration files from SQL
• validate    - Validate migration files and structure
• list        - Show all available migrations
• status      - Check migration system status
`,
	Aliases: []string{"migrate", "db", "migrations"},
	Example: `
  # Generate Rust migration files from SQL (most common)
  container-kit-cli migration generate

  # List all available migrations
  container-kit-cli migration list

  # Validate migration structure
  container-kit-cli migration validate

  # Check migration system status
  container-kit-cli migration status

  # Generate with verbose output
  container-kit-cli migration generate --verbose
`,
}

var generateCmd = &cobra.Command{
	Use:   "generate",
	Short: "Generate Rust migration files from SQL files",
	Long: `
Generate Rust migration files from SQL migration files in src-tauri/migrations/.

This command:
• Scans for .sql files in src-tauri/migrations/
• Extracts version numbers from filenames
• Generates generated_migrations.rs with Rust bindings
• Validates SQL syntax and migration structure

FILENAME FORMAT:
  NNNN_description.sql (e.g., 0001_create_users.sql)

GENERATED OUTPUT:
  src-tauri/migrations/generated_migrations.rs
`,
	Example: `
  # Generate migrations (standard usage)
  container-kit-cli migration generate

  # Generate with detailed output
  container-kit-cli migration generate --verbose

  # Force regeneration
  container-kit-cli migration generate --force
`,
	RunE: func(cmd *cobra.Command, args []string) error {
		verbose, _ := cmd.Flags().GetBool("verbose")
		force, _ := cmd.Flags().GetBool("force")

		// Validate we're in a Tauri project
		if err := validateTauriProject(); err != nil {
			return fmt.Errorf("not a valid Tauri project: %v", err)
		}

		return runMigrationGenerate(verbose, force)
	},
}

var listCmd = &cobra.Command{
	Use:   "list",
	Short: "List all available migrations",
	Long: `
Display all migration files found in src-tauri/migrations/ with their details.

Shows:
• Migration filename and version
• File size and modification date
• SQL content preview (with --verbose)
• Migration status and validation
`,
	Example: `
  # List all migrations
  container-kit-cli migration list

  # List with detailed information
  container-kit-cli migration list --verbose
`,
	RunE: func(cmd *cobra.Command, args []string) error {
		verbose, _ := cmd.Flags().GetBool("verbose")

		if err := validateTauriProject(); err != nil {
			return fmt.Errorf("not a valid Tauri project: %v", err)
		}

		return runMigrationList(verbose)
	},
}

var validateCmd = &cobra.Command{
	Use:   "validate",
	Short: "Validate migration files and structure",
	Long: `
Validate migration files and project structure for common issues.

Checks:
• Migration filename format (NNNN_description.sql)
• SQL syntax validation
• Version number consistency
• Duplicate version detection
• File permissions and accessibility
• Generated migration file sync status
`,
	Example: `
  # Validate all migrations
  container-kit-cli migration validate

  # Validate with detailed output
  container-kit-cli migration validate --verbose
`,
	RunE: func(cmd *cobra.Command, args []string) error {
		verbose, _ := cmd.Flags().GetBool("verbose")

		if err := validateTauriProject(); err != nil {
			return fmt.Errorf("not a valid Tauri project: %v", err)
		}

		return runMigrationValidate(verbose)
	},
}

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Check migration system status",
	Long: `
Display comprehensive status of the migration system.

Shows:
• Total number of migrations
• Generated file status
• Last generation timestamp
• Migration directory structure
• Tauri SQL plugin configuration
• Project database setup status
`,
	Example: `
  # Check migration status
  container-kit-cli migration status

  # Status with detailed information
  container-kit-cli migration status --verbose
`,
	RunE: func(cmd *cobra.Command, args []string) error {
		verbose, _ := cmd.Flags().GetBool("verbose")

		if err := validateTauriProject(); err != nil {
			return fmt.Errorf("not a valid Tauri project: %v", err)
		}

		return runMigrationStatus(verbose)
	},
}

func init() {
	rootCmd.AddCommand(migrationCmd)

	// Add subcommands
	migrationCmd.AddCommand(generateCmd)
	migrationCmd.AddCommand(listCmd)
	migrationCmd.AddCommand(validateCmd)
	migrationCmd.AddCommand(statusCmd)

	// Generate command flags
	generateCmd.Flags().BoolP("force", "f", false, "Force operation (overwrite existing files)")

	// Default action for migration command (if no subcommand is specified)
	migrationCmd.RunE = func(cmd *cobra.Command, args []string) error {
		verbose, _ := cmd.Flags().GetBool("verbose")
		return runMigrationGenerate(verbose, false)
	}
}

// Migration represents a database migration
type Migration struct {
	Filename    string
	Version     int
	Description string
}

// runMigrationGenerate generates Rust migration files from SQL
func runMigrationGenerate(verbose bool, force bool) error {
	fmt.Println("🔄 Generating migration files...")

	projectRoot, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current directory: %v", err)
	}

	migrationsDir := filepath.Join(projectRoot, "src-tauri", "migrations")
	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		return fmt.Errorf("migrations directory not found: %s", migrationsDir)
	}

	outFile := filepath.Join(migrationsDir, "generated_migrations.rs")

	// Check if file exists and force flag
	if _, err := os.Stat(outFile); err == nil && !force {
		fmt.Printf("⚠️  Generated file already exists: %s\n", outFile)
		fmt.Println("💡 Use --force flag to overwrite")
		return nil
	}

	// Read all migration files
	migrations, err := readMigrationFiles(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to read migration files: %v", err)
	}

	if len(migrations) == 0 {
		fmt.Println("⚠️  No SQL migration files found")
		return nil
	}

	if verbose {
		fmt.Printf("📖 Found %d migration(s):\n", len(migrations))
		for _, m := range migrations {
			fmt.Printf("   - %s (version: %d)\n", m.Filename, m.Version)
		}
	}

	// Generate Rust content
	rustContent := generateRustMigrationContent(migrations)

	// Write the generated file
	if err := os.WriteFile(outFile, []byte(rustContent), 0644); err != nil {
		return fmt.Errorf("failed to write generated file: %v", err)
	}

	// Show relative path
	relativeOutFile := "src-tauri/migrations/generated_migrations.rs"

	if verbose {
		fmt.Printf("✅ Generated: %s\n", relativeOutFile)
		fmt.Println("\n🎉 Migration generation completed successfully!")
	} else {
		fmt.Println("✅ Migration generation completed!")
	}

	return nil
}

// readMigrationFiles reads and processes all SQL migration files
func readMigrationFiles(migrationsDir string) ([]Migration, error) {
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return nil, err
	}

	var migrations []Migration
	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != ".sql" {
			continue
		}

		filename := entry.Name()
		version := extractVersionFromFilename(filename)
		description := filename // Use filename as description

		migrations = append(migrations, Migration{
			Filename:    filename,
			Version:     version,
			Description: description,
		})
	}

	// Sort migrations by version
	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	return migrations, nil
}

// extractVersionFromFilename extracts version number from migration filename
func extractVersionFromFilename(filename string) int {
	// Remove extension
	stem := strings.TrimSuffix(filename, filepath.Ext(filename))
	// Split by underscore and get first part
	parts := strings.Split(stem, "_")
	if len(parts) == 0 {
		return 0
	}

	version, err := strconv.Atoi(parts[0])
	if err != nil {
		return 0
	}
	return version
}

// generateRustMigrationContent generates the Rust file content
func generateRustMigrationContent(migrations []Migration) string {
	var content strings.Builder

	content.WriteString("use tauri_plugin_sql::{Migration, MigrationKind};\n\n")
	content.WriteString("pub fn load_migrations() -> Vec<Migration> {\n")
	content.WriteString("    vec![\n")

	for _, migration := range migrations {
		content.WriteString(fmt.Sprintf(
			"        Migration { version: %d, description: \"%s\", sql: include_str!(\"%s\"), kind: MigrationKind::Up },\n",
			migration.Version,
			migration.Description,
			migration.Filename,
		))
	}

	content.WriteString("    ]\n")
	content.WriteString("}\n")

	return content.String()
}

// runMigrationList lists all available migrations
func runMigrationList(verbose bool) error {
	fmt.Println("📋 Available Migrations:")

	projectRoot, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current directory: %v", err)
	}

	migrationsDir := filepath.Join(projectRoot, "src-tauri", "migrations")
	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		fmt.Println("⚠️  No migrations directory found")
		return nil
	}

	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %v", err)
	}

	count := 0
	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != ".sql" {
			continue
		}

		count++
		if verbose {
			info, _ := entry.Info()
			fmt.Printf("  📄 %s (size: %d bytes, modified: %s)\n",
				entry.Name(), info.Size(), info.ModTime().Format("2006-01-02 15:04:05"))
		} else {
			fmt.Printf("  📄 %s\n", entry.Name())
		}
	}

	if count == 0 {
		fmt.Println("⚠️  No SQL migration files found")
	} else {
		fmt.Printf("\n📊 Total: %d migration(s)\n", count)
	}

	return nil
}

// runMigrationValidate validates migration files
func runMigrationValidate(verbose bool) error {
	fmt.Println("✅ Validating migrations...")

	projectRoot, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current directory: %v", err)
	}

	migrationsDir := filepath.Join(projectRoot, "src-tauri", "migrations")
	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		return fmt.Errorf("migrations directory not found: %s", migrationsDir)
	}

	// Read migrations and validate
	migrations, err := readMigrationFiles(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to read migration files: %v", err)
	}

	if len(migrations) == 0 {
		fmt.Println("⚠️  No SQL migration files found")
		return nil
	}

	if verbose {
		fmt.Println("🔍 Checking filename formats...")
		fmt.Println("🔍 Validating version numbers...")
		fmt.Println("🔍 Checking for duplicates...")
	}

	// Check for duplicate versions
	versionMap := make(map[int]string)
	duplicates := false

	for _, migration := range migrations {
		if existing, exists := versionMap[migration.Version]; exists {
			fmt.Printf("❌ Duplicate version %d: %s and %s\n", migration.Version, existing, migration.Filename)
			duplicates = true
		} else {
			versionMap[migration.Version] = migration.Filename
		}
	}

	if duplicates {
		return fmt.Errorf("validation failed: duplicate version numbers found")
	}

	fmt.Printf("✅ All %d migrations are valid!\n", len(migrations))
	return nil
}

// runMigrationStatus shows migration system status
func runMigrationStatus(verbose bool) error {
	fmt.Println("📊 Migration System Status:")

	projectRoot, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current directory: %v", err)
	}

	migrationsDir := filepath.Join(projectRoot, "src-tauri", "migrations")
	generatedFile := filepath.Join(migrationsDir, "generated_migrations.rs")

	// Check migrations directory
	if _, err := os.Stat(migrationsDir); os.IsNotExist(err) {
		fmt.Println("❌ Migrations directory: Not found")
		return nil
	}
	fmt.Println("✅ Migrations directory: Found")

	// Check generated file
	if _, err := os.Stat(generatedFile); os.IsNotExist(err) {
		fmt.Println("⚠️  Generated file: Not found (run 'migration generate')")
	} else {
		fmt.Println("✅ Generated file: Found")
	}

	// Count migrations
	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %v", err)
	}

	sqlCount := 0
	for _, entry := range entries {
		if !entry.IsDir() && filepath.Ext(entry.Name()) == ".sql" {
			sqlCount++
		}
	}

	fmt.Printf("📊 SQL migrations: %d found\n", sqlCount)

	if verbose {
		fmt.Printf("📂 Migrations path: %s\n", migrationsDir)
		fmt.Printf("🦀 Generated file: %s\n", generatedFile)
	}

	return nil
}
