# Migration Generator

A Node.js script that generates Rust migration files from your Drizzle SQL migrations, similar to the original Rust implementation in `src-tauri/generate-migrations.rs`.

## Overview

This script reads SQL migration files created by `drizzle-kit generate` and creates a Rust file that can be used with `tauri-plugin-sql` for database migrations in your Tauri application.

## Files

- `generate-migrations.js` - JavaScript version
- `generate-migrations.ts` - TypeScript version (recommended)
- `test-migrations.js` - Test script to verify functionality

## How it Works

1. Scans the `./src-tauri/migrations/` directory for `.sql` files
2. Extracts version numbers from filenames (e.g., `0000_slow_scarecrow.sql` → version 0)
3. Generates a Rust file with `load_migrations()` function that returns a `Vec<Migration>`
4. Uses `include_str!()` macro to embed SQL content at compile time

## Usage

### Run the generator

```bash
# Using CLI (recommended)
pnpm migration:generate

# Using TypeScript script directly
pnpm db:migrations
```

### Test the generator

```bash
node test-migrations.js
```

## Generated Output

The script creates `./rust-migrations/generated_migrations.rs` with content like:

```rust
use tauri_plugin_sql::{Migration, MigrationKind};

pub fn load_migrations() -> Vec<Migration> {
    vec![
        Migration { version: 0, description: "init", sql: include_str!("0000_slow_scarecrow.sql"), kind: MigrationKind::Up },
    ]
}
```

## Configuration

You can modify the paths in the script constructor:

```typescript
class MigrationGenerator {
    private readonly outDir: string = './rust-migrations'; // Output directory
    private readonly migrationsDir: string = './src-tauri/migrations'; // Input directory
    private readonly outFile: string = path.join(this.outDir, 'generated_migrations.rs');
}
```

## Integration with Your Tauri App

1. Copy the generated `generated_migrations.rs` to your Tauri `src/` directory
2. Import and use in your Rust code:

```rust
mod generated_migrations;
use generated_migrations::load_migrations;

// In your Tauri setup
let migrations = load_migrations();
// Use with tauri-plugin-sql
```

## Workflow

1. Update your Drizzle schema (`src/lib/db/schema.ts`)
2. Run `pnpm db:generate` to create SQL migrations
3. Run `pnpm migration:generate` to create Rust migrations
4. Copy/use the generated Rust file in your Tauri application

## CLI Commands

The CLI provides additional migration management commands:

```bash
# Generate migrations with CLI (recommended)
pnpm migration:generate

# List all migrations
pnpm migration:list

# Validate migration files
pnpm migration:validate

# Check migration system status
pnpm migration:status

# Interactive migration management
pnpm migration:interactive
```

## Features

- ✅ Reads SQL migration files from Drizzle
- ✅ Extracts version numbers from filenames
- ✅ Generates Rust code with proper `tauri-plugin-sql` format
- ✅ Sorts migrations by version number
- ✅ TypeScript and JavaScript versions available
- ✅ Comprehensive error handling
- ✅ Test script included

## File Structure

```
ContainerKit/
├── src-tauri/
│   └── migrations/          # Input: Drizzle SQL migrations
│       ├── 0000_*.sql
│       └── meta/
├── rust-migrations/         # Output: Generated Rust files
│   └── generated_migrations.rs
└── scripts/
    ├── generate-migrations.ts    # Main generator (TypeScript)
    ├── generate-migrations.js    # Main generator (JavaScript)
    └── test-migrations.js        # Test script
```

## Troubleshooting

### No SQL migration files found

- Make sure you've run `pnpm db:generate` first
- Check that migrations exist in `./src-tauri/migrations/`
- Ensure files have `.sql` extension

### Permission errors

- Make sure the output directory is writable
- Check file permissions in your project

### Generated file has incorrect paths

- Verify the `migrationsDir` path in the script
- Ensure relative paths are correct for your project structure

## Comparison with Original Rust Version

| Feature            | Rust Version | Node.js Version                 |
| ------------------ | ------------ | ------------------------------- |
| Language           | Rust         | JavaScript/TypeScript           |
| Input scanning     | ✅           | ✅                              |
| Version extraction | ✅           | ✅                              |
| File copying       | ✅           | ❌ (uses include_str! directly) |
| Error handling     | ✅           | ✅                              |
| Output format      | ✅           | ✅                              |

The Node.js version simplifies the process by using `include_str!()` directly with the original filenames instead of copying files first.
