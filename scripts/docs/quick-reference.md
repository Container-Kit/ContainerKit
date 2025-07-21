# Container Kit Scripts - Developer Quick Reference

## 🚀 Most Common Commands

### Complete Release Workflow

```bash
# Complete build and release process (version from tauri.conf.json)
pnpm release

# With custom version override and development domain
pnpm release -- -v 1.0.0 -d https://dev.mydomain.com

# Force overwrite existing build artifacts
pnpm release:force

# Skip build step (only copy existing artifacts for testing)
pnpm release:skip-build

# Skip copy step (build only for development)
pnpm release:skip-copy
```

### Individual Build Operations

```bash
# Build Tauri app with dependencies (version from tauri.conf.json)
pnpm build:tauri

# Build without dependency preparation (faster developer iteration)
pnpm build:tauri:skip-deps

# Show build help
pnpm build:tauri:help
```

### Individual Copy Operations

```bash
# Copy build files to release directories (version from tauri.conf.json)
pnpm copy:build-files

# Force overwrite existing build artifacts
pnpm copy:build-files:force

# Copy with custom development domain
pnpm copy:build-files:custom https://dev.example.com

# Show copy help
pnpm copy:build-files:help
```

### Database Migration Generation

```bash
# Generate Rust migrations from Drizzle SQL for development
pnpm db:migrations

# Full database development workflow
pnpm db:generate  # Generate SQL from schema, then generate Rust bindings
```

## 📋 Pre-Build Developer Checklist

- [ ] Update version in `src-tauri/tauri.conf.json` (primary version source)
- [ ] Ensure `.env` file has signing keys configured for development
- [ ] Run `pnpm install` to update dependencies
- [ ] Test build locally: `pnpm build:tauri`
- [ ] Verify updater config in `tauri.conf.json` for development testing
- [ ] Commit all changes to version control before building

## 🗂️ Developer Build Output Structure

### Build Artifacts (after `build-tauri.ts`)

```
src-tauri/target/{target}/release/bundle/
├── dmg/
│   └── Container Kit_{version}_{target}.dmg
└── macos/
    ├── Container Kit.app/
    ├── Container Kit.app.tar.gz
    └── Container Kit.app.tar.gz.sig
```

### Developer Release Structure (after `copy-build-files-to-release.ts`)

```
release/
├── index.json                              # Master version index
├── README.md                               # Auto-generated docs
└── {version}/
    ├── update.json                         # Updater manifest
    └── macos/
        ├── Container Kit.app.tar.gz        # Update bundle
        ├── Container Kit.app.tar.gz.sig    # Signature
        ├── Container Kit.app/              # App directory
        └── Container Kit_{version}_{target}.dmg  # Installer
```

## ⚙️ Script Options

### build-tauri.ts

| Flag          | Description                 | Example                     |
| ------------- | --------------------------- | --------------------------- |
| `-v`          | Override version            | `-v 1.0.0`                  |
| `-t`          | Build target architecture   | `-t universal-apple-darwin` |
| `--skip-deps` | Skip dependency preparation | `--skip-deps`               |

### copy-build-files-to-release.ts

| Flag | Description      | Example                            |
| ---- | ---------------- | ---------------------------------- |
| `-d` | Custom domain    | `-d https://releases.mydomain.com` |
| `-v` | Override version | `-v 1.0.0`                         |
| `-f` | Force overwrite  | `-f`                               |

### build-and-copy-to-release.ts (Complete Workflow)

| Flag           | Description                 | Example                            |
| -------------- | --------------------------- | ---------------------------------- |
| `-d`           | Custom domain               | `-d https://releases.mydomain.com` |
| `-v`           | Override version            | `-v 1.0.0`                         |
| `-t`           | Build target                | `-t universal-apple-darwin`        |
| `-f`           | Force overwrite             | `-f`                               |
| `--skip-build` | Skip build step             | `--skip-build`                     |
| `--skip-deps`  | Skip dependency preparation | `--skip-deps`                      |
| `--skip-copy`  | Skip copy step              | `--skip-copy`                      |

## 🔧 Direct Script Usage

```bash
# TypeScript scripts (preferred)
tsx scripts/build-tauri.ts --help
tsx scripts/copy-build-files-to-release.ts --help
tsx scripts/build-and-copy-to-release.ts --help

# With custom options
tsx scripts/build-and-copy-to-release.ts -v 1.2.0 -d https://releases.mydomain.com

# Individual operations
tsx scripts/build-tauri.ts --skip-deps
tsx scripts/copy-build-files-to-release.ts -f
```

## 🔄 Common Workflows

### Development Iteration

```bash
# Fast build iteration (skip deps)
pnpm build:tauri:skip-deps

# Test different release configurations
pnpm copy:build-files:force
```

### Multi-target Builds

```bash
# Build for Intel Mac
pnpm release -- -t x86_64-apple-darwin

# Build for Apple Silicon (default)
pnpm release -- -t aarch64-apple-darwin

# Build universal binary
pnpm release -- -t universal-apple-darwin
```

### CI/CD Integration

```bash
# Automated development build with environment variables
pnpm release -- -v $BUILD_VERSION -d $DEV_DOMAIN

# Separate build and deploy stages for development
pnpm release -- --skip-copy  # Build stage
pnpm release -- --skip-build -d $DEV_DOMAIN  # Deploy stage
```

## ⚠️ Common Issues and Solutions

### Build Artifacts Missing

```bash
# Solution: Run build first (version will be read from tauri.conf.json)
pnpm build:tauri
```

### Build Artifacts Already Exist

```bash
# Solution: Use force flag to overwrite
pnpm copy:build-files:force
# or
pnpm release:force
```

### Signing Key Issues

```bash
# Check .env file exists with:
TAURI_SIGNING_PRIVATE_KEY="..."
TAURI_SIGNING_PRIVATE_KEY_PASSWORD="..."
```

### Tool Not Found Errors

```bash
# Install required tools
cargo install tauri-cli
npm install -g pnpm
```

### Permission Errors

```bash
# Check file permissions
ls -la src-tauri/target/*/release/bundle/
```

## 🗄️ Database Development Workflow

### After Schema Changes in Development

```bash
# 1. Update schema in src/lib/db/schema.ts
# 2. Generate SQL migrations for development
pnpm db:generate

# 3. Generate Rust migration bindings for Tauri integration
pnpm db:migrations

# 4. Verify migrations in development environment
ls -la src-tauri/migrations/
```

## 📤 Developer Deployment Steps

1. **Generate Build**: `pnpm release -d https://dev.mydomain.com` (version from tauri.conf.json)
2. **Upload Files**: Upload `release/` directory to your development server
3. **Configure CORS**: Allow your development app domain to access files
4. **Test Updates**: Launch development app and verify auto-update functionality
5. **Validate Build**: Test download links and update manifests

## 🔗 Key Developer URLs After Build

Replace `{version}` (from tauri.conf.json) and `{domain}` with actual values:

- **Update manifest**: `{domain}/{version}/update.json`
- **DMG download**: `{domain}/{version}/macos/Container%20Kit_{version}_{target}.dmg`
- **App bundle**: `{domain}/{version}/macos/Container%20Kit.app.tar.gz`
- **Build index**: `{domain}/index.json`

## 🐛 Developer Debug Mode

Enable detailed logging for development troubleshooting:

```bash
DEBUG=1 tsx scripts/build-tauri.ts
DEBUG=1 tsx scripts/copy-build-files-to-release.ts
DEBUG=1 tsx scripts/build-and-copy-to-release.ts
```

## 📚 Full Documentation

For detailed information, see:

- **[README.md](./README.md)** - Complete scripts overview
- **[build-tauri.md](./build-tauri.md)** - Build process details
- **[copy-to-release.md](./copy-to-release.md)** - Release packaging details
- **[build-and-copy-to-release.md](./build-and-copy-to-release.md)** - Complete workflow
- **[generate-migrations.md](./generate-migrations.md)** - Database migrations
- **[shared-utils.md](./shared-utils.md)** - Shared utilities
- **[template-system.md](./template-system.md)** - Template system

## 🎯 Developer Pro Tips

1. **Use `--skip-deps`** for faster iteration during development cycles
2. **Test locally** before deploying: verify DMG opens and app runs in development
3. **Check file sizes** in build summary to catch unexpected changes
4. **Use force flags** carefully - they overwrite existing build artifacts
5. **Version source** is always `src-tauri/tauri.conf.json` unless explicitly overridden
6. **Monitor logs** during CI/CD to catch build issues early
