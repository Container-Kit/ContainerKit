# 📚 Scripts Guide

This document provides a comprehensive overview of all available pnpm scripts in the Container Kit project.

## 🔄 Core Development Scripts

> **⚠️ DO NOT CHANGE** - These are the primary development commands used by the team

| Script    | Command        | Description                              |
| --------- | -------------- | ---------------------------------------- |
| `dev`     | `pnpm dev`     | Start development server with hot reload |
| `build`   | `pnpm build`   | Build the application for production     |
| `preview` | `pnpm preview` | Preview the production build             |
| `tauri`   | `pnpm tauri`   | Run Tauri CLI commands                   |

### Examples

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run Tauri commands
pnpm tauri dev
pnpm tauri build
```

## 🎨 Code Quality & Maintenance

| Script        | Command            | Description                     |
| ------------- | ------------------ | ------------------------------- |
| `check`       | `pnpm check`       | Run Svelte type checking        |
| `check:watch` | `pnpm check:watch` | Run type checking in watch mode |
| `format`      | `pnpm format`      | Format code with Prettier       |
| `lint`        | `pnpm lint`        | Check code formatting           |

### Examples

```bash
# Check types
pnpm check

# Format all files
pnpm format

# Check if code is properly formatted
pnpm lint
```

## 🏗️ Build Scripts

| Script        | Command            | Description                                    |
| ------------- | ------------------ | ---------------------------------------------- |
| `build:tauri` | `pnpm build:tauri` | Build Tauri application with TypeScript script |
| `build:cli`   | `pnpm build:cli`   | Build the Go CLI binary                        |

### Examples

```bash
# Build Tauri app
pnpm build:tauri

# Build CLI only
pnpm build:cli
```

## ⚡ CLI Scripts

| Script      | Command          | Description                         |
| ----------- | ---------------- | ----------------------------------- |
| `cli`       | `pnpm cli`       | Run the Container Kit CLI           |
| `cli:build` | `pnpm cli:build` | Build CLI and run interactive build |
| `cli:help`  | `pnpm cli:help`  | Show CLI help                       |

### Examples

```bash
# Show CLI help
pnpm cli:help

# Build for Apple Silicon (default)
pnpm cli:build


```

## 🗄️ Database Scripts

| Script          | Command              | Description                             |
| --------------- | -------------------- | --------------------------------------- |
| `db:push`       | `pnpm db:push`       | Push schema changes to database         |
| `db:generate`   | `pnpm db:generate`   | Generate SQL migrations + Rust bindings |
| `db:migrations` | `pnpm db:migrations` | Generate Rust migration bindings only   |
| `db:studio`     | `pnpm db:studio`     | Open Drizzle Studio                     |

### Examples

```bash
# Generate migrations after schema changes
pnpm db:generate

# Open database studio
pnpm db:studio

# Push schema to database
pnpm db:push
```

## 🚀 Migration Management

| Script               | Command                   | Description                   |
| -------------------- | ------------------------- | ----------------------------- |
| `migration`          | `pnpm migration`          | Run migration CLI             |
| `migration:generate` | `pnpm migration:generate` | Generate Rust migration files |
| `migration:list`     | `pnpm migration:list`     | List all available migrations |
| `migration:validate` | `pnpm migration:validate` | Validate migration files      |
| `migration:status`   | `pnpm migration:status`   | Check migration system status |

### Examples

```bash
# Generate migration files
pnpm migration:generate

# Check what migrations exist
pnpm migration:list

# Validate migration structure
pnpm migration:validate
```

## 🌟 Common Workflows

### Initial Setup

```bash
# Install dependencies
pnpm install

# Check everything is working
container-kit-cli migration status
```

### Daily Development

```bash
# Start development server
pnpm dev

# In another terminal, check types
pnpm check:watch
```

### Schema Changes

```bash
# 1. Update schema in src/lib/db/schema.ts
# 2. Generate migrations
pnpm db:generate

# 3. Verify migrations
pnpm migration:list
pnpm migration:validate
```

### Building for Production

```bash
# Quick build
# Build for production
pnpm build

# Build with CLI (Apple Silicon default)
pnpm cli:build

# Or direct Tauri build
pnpm build:tauri
```

### Code Quality Check

```bash
# Format and check code
pnpm format
pnpm lint
pnpm check
```

## 🚨 Troubleshooting

### CLI Build Issues

```bash
# Rebuild CLI
pnpm build:cli

# Check CLI status
pnpm cli:help
```

### Database Issues

```bash
# Check migration status
pnpm migration:status

# Regenerate migrations
pnpm db:generate
```

### Clean Start

```bash
# Clean build artifacts
rm -rf node_modules .svelte-kit build
pnpm install
```

## 📝 Script Categories

## 📝 Documentation

### Project Documentation

- `README.md` - Project overview and setup guide
- `SCRIPTS.md` - This file, comprehensive script documentation
- `llm.txt` - AI/LLM context for the entire project

### CLI Documentation

- `cli/README.md` - CLI tool documentation and usage
- `cli/llm.txt` - CLI-specific AI/LLM context and architecture

### Migration Documentation

- `scripts/README-migrations.md` - Migration system documentation

## 📝 Script Categories

- **🔄 Core**: Essential development commands (don't change these)
- **🎨 Quality**: Code formatting and type checking
- **🏗️ Build**: Compilation and bundling
- **⚡ CLI**: Container Kit CLI operations
- **🗄️ Database**: Schema and migration management
- **🚀 Migration**: Migration-specific operations

## 💡 Tips

1. **Use verbose mode** by default - most commands show helpful output
2. **Check status** before making changes: `container-kit-cli migration status`
3. **Format code** before commits: `pnpm format`
4. **Validate migrations** after changes: `pnpm migration:validate`

---

## 🤖 AI/LLM Context Files

This project includes comprehensive context files for AI assistants:

- **`llm.txt`** - Main project architecture, tech stack, and development patterns
- **`cli/llm.txt`** - CLI-specific architecture, Bubble Tea patterns, and command structure

These files help AI assistants understand the project better and provide more accurate assistance.

---

_For more detailed information about specific commands, use `pnpm cli:help` or check individual command help with `--help` flag._
