# 📚 Scripts Guide

This document provides a comprehensive overview of all available pnpm scripts in the Container Kit project.

## 🔄 Core Development Scripts

> **⚠️ DO NOT CHANGE** - These are the primary development commands used by the team

| Purspose     | Command            | Description                              |
| ------------ | ------------------ | ---------------------------------------- |
| `dev`        | `pnpm tauri dev`   | Start development server with hot reload |
| `build`      | `pnpm tauri build` | Build the application for test           |
| `production` | `pnpm tauri:build` | Build for production                     |

### Examples

```bash
# Run Tauri commands
pnpm tauri dev
pnpm tauri build
pnpm tauri:build
```

## 🎨 Code Quality & Maintenance

| Script        | Command            | Description                     |
| ------------- | ------------------ | ------------------------------- |
| `check`       | `pnpm check`       | Run Svelte type checking        |
| `check:watch` | `pnpm check:watch` | Run type checking in watch mode |
| `format`      | `pnpm format`      | Format code with Prettier       |
| `lint`        | `pnpm lint`        | Check code formatting           |

## 🏗️ Build Scripts

| Script        | Command            | Description                                         |
| ------------- | ------------------ | --------------------------------------------------- |
| `tauri:build` | `pnpm tauri:build` | Build Tauri application for Apple Silicon (aarch64) |

```bash
# Build Tauri app for production (Apple Silicon)
pnpm tauri:build
```

## 🗄️ Database Scripts

| Script               | Command                   | Description                             |
| -------------------- | ------------------------- | --------------------------------------- |
| `db:generate`        | `pnpm db:generate`        | Generate SQL migrations + Rust bindings |
| `db:migrations:rust` | `pnpm db:migrations:rust` | Generate Rust migration bindings only   |

```bash
# Generate migrations after schema changes
pnpm db:generate

# Generate only Rust migration bindings
pnpm db:migrations:rust
```

## 🛠️ Additional Scripts

### Scripts

The project includes additional shell scripts in the `scripts/` directory:

| Script                            | Description                                        |
| --------------------------------- | -------------------------------------------------- |
| `download-apple-container-cli.sh` | Download and extract Apple Container CLI for Tauri |
| `generate-migrations.ts`          | TypeScript script to generate Rust migration files |

### Examples

```bash
# Download Apple Container CLI
./scripts/download-apple-container-cli.sh

# Generate migrations (called automatically by db:generate)
tsx scripts/generate-migrations.ts
```

## 🌟 Common Workflows

### Initial Setup

```bash
# Install dependencies
pnpm install

# Generate database migrations
pnpm db:generate
```

### Daily Development

```bash
# Start development server
pnpm tauri dev
```

### Schema Changes

```bash
# 1. Update schema in src/lib/db/schema.ts
# 2. Generate migrations
pnpm db:generate

# 3. Build will automatically include latest migrations
pnpm tauri:build
```

### Building for Production

```bash
# Build Tauri application for Apple Silicon
pnpm tauri:build
```

### Code Quality Check

```bash
# Format and check code
pnpm format
pnpm lint
pnpm check
```

## 🚨 Troubleshooting

### Build Issues

```bash
# Clean and rebuild
rm -rf node_modules .svelte-kit build
pnpm install
pnpm tauri:build
```

### Database Issues

```bash
# Regenerate migrations
pnpm db:generate
```

### Tauri Build Issues

```bash
# Check Tauri setup
pnpm tauri info

# Clean Tauri build
pnpm tauri build --help
```

## 📝 Script Categories

- **🔄 Core**: Essential development commands (don't change these)
- **🎨 Quality**: Code formatting and type checking
- **🏗️ Build**: Compilation and bundling
- **🗄️ Database**: Schema and migration management
- **🛠️ Additional**: Helper scripts and tools

## 💡 Tips

1. **Build includes migrations** - `pnpm tauri:build` automatically runs `db:generate`
2. **Format before commits** - Always run `pnpm format` before committing
3. **Use watch mode** - `pnpm check:watch` for continuous type checking
4. **Apple Silicon App** - `tauri:build` targets aarch64-apple-darwin by default

## 📁 Project Structure

```
ContainerKit/
├── scripts/
│   ├── docs/                           # Script documentation
│   ├── download-apple-container-cli.sh # Apple CLI download script
│   └── generate-migrations.ts          # Migration generator
├── src-tauri/
│   └── migrations/                     # Generated migration files
└── package.json                       # All pnpm scripts defined here
```

## 📚 Documentation

### Script Documentation

- `scripts/docs/download-apple-container-cli.md` - Apple Container CLI download script documentation

### Project Documentation

- `README.md` - Project overview and setup guide
- `SCRIPTS.md` - This file, comprehensive script documentation

## 🔧 Environment Variables

Some scripts require environment variables:

### Tauri Build

```bash
# Required for signed builds
TAURI_SIGNING_PRIVATE_KEY=your_key_here
TAURI_SIGNING_PRIVATE_KEY_PASSWORD=your_password_here
```

Create a `.env` file in the project root with these variables for `pnpm tauri:build`.

---
