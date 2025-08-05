# Migration Generator

A Node.js script that generates a Rust migration file from Drizzle SQL migrations.

## Overview

This script reads SQL migration files created by `drizzle-kit generate` and creates a Rust file that can be used with `tauri-plugin-sql` for database migrations in your Tauri application.

## Files
- `generate-migrations.ts` - TypeScript version (recommended)

## How it Works

1. Scans the `./src-tauri/migrations/` directory for `.sql` files
2. Extracts version numbers from filenames (e.g., `0000_slow_scarecrow.sql` → version 0)
3. Generates a Rust file with `load_migrations()` function that returns a `Vec<Migration>`
4. Uses `include_str!()` macro to embed SQL content at compile time

## Usage

### Run the generator

```bash
# Using CLI
pnpm db:generate
```

## Generated Output

The script creates `./generated_migrations.rs` with content like:

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

## How to use generated rust file:

```rust
include!(concat!("../migrations", "/generated_migrations.rs"));
```

## Workflow

1. Update your Drizzle schema (`src/lib/db/schema.ts`)
2. Run `pnpm db:generate` to create SQL migrations

## Features

- ✅ Reads SQL migration files from Drizzle
- ✅ Extracts version numbers from filenames
- ✅ Generates Rust code with proper `tauri-plugin-sql` format
- ✅ Sorts migrations by version number
- ✅ Comprehensive error handling

## Troubleshooting

### No SQL migration files found

- Make sure you've run `pnpm db:generate` first
- Check that migrations exist in `./src-tauri/migrations/`
- Ensure files have `.sql` extension

### Permission errors

- Make sure the output directory is writable
- Check file permissions in project

### Generated file has incorrect paths

- Verify the `migrationsDir` path in the script
- Ensure relative paths are correct for project structure
