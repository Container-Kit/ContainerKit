# Container Kit CLI

A command-line interface for building and signing Container Kit Tauri applications.

## Overview

Container Kit CLI is a clean, streamlined tool that provides essential commands for building and managing your Tauri applications. It offers direct command execution without complex interfaces, making it perfect for both interactive use and CI/CD pipelines.

## Features

- **Build Management**: Build and package Tauri applications for multiple targets
- **Migration Management**: Generate and manage database migrations
- **Code Signing**: Automatic code signing for macOS DMG and App bundles
- **Simple & Fast**: Direct command execution without TUI overhead
- **CI/CD Ready**: Perfect for automated pipelines

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/your-org/container-kit.git
cd container-kit/cli

# Build locally
./build.sh local

# Install (optional)
./build.sh install
```

### Using Go

```bash
go install github.com/container-kit/cli@latest
```

## Usage

### Basic Commands

```bash
# Show help
container-kit-cli --help

# Check version
container-kit-cli --version

# Enable verbose output for any command
container-kit-cli [command] --verbose
```

### Build Commands

Build your Tauri application for different targets:

```bash
# Build for Apple Silicon (default)
container-kit-cli build

# Build for universal compatibility
container-kit-cli build --target universal

# Build in debug mode
container-kit-cli build --mode debug

# Build with verbose output
container-kit-cli build --verbose
```

**Available Targets:**

- `aarch64-apple-darwin` - Apple Silicon (M1/M2/M3) - Default for macOS 26+
- `universal` - Universal macOS binary (Intel + Apple Silicon)
- `x86_64-apple-darwin` - Intel macOS

**Build Modes:**

- `release` - Production build (default)
- `debug` - Development build

### Migration Commands

Manage database migrations:

```bash
# Generate Rust migration files from SQL
container-kit-cli migration generate

# List all migrations
container-kit-cli migration list

# Validate migration files
container-kit-cli migration validate

# Check migration system status
container-kit-cli migration status
```

## Project Structure

The CLI expects to be run from a valid Tauri project directory with the following structure:

```
your-project/
├── package.json
├── src-tauri/
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   └── migrations/           # SQL migration files
│       ├── 0001_init.sql
│       └── generated_migrations.rs
└── src/                      # Frontend source
```

## Migration Workflow

1. **Create SQL Migration Files**

    ```bash
    # Create in src-tauri/migrations/
    # Format: NNNN_description.sql
    echo "CREATE TABLE users (id INTEGER PRIMARY KEY);" > src-tauri/migrations/0001_create_users.sql
    ```

2. **Generate Rust Bindings**

    ```bash
    container-kit-cli migration generate
    ```

3. **Migrations are Applied Automatically**
    - Migrations run automatically when the app starts
    - Generated file: `src-tauri/migrations/generated_migrations.rs`

## Environment Setup

### Requirements

- **macOS**: 26+ with Xcode Command Line Tools (Apple Silicon recommended)
- **Node.js**: 16+ with pnpm package manager
- **Rust**: Latest stable version with cargo
- **Tauri**: Installed via pnpm

### Environment Variables

Create a `.env` file in your project root for code signing:

```bash
# macOS Code Signing (optional)
APPLE_CERTIFICATE_NAME="Developer ID Application: Your Name"
APPLE_SIGNING_IDENTITY="Your Signing Identity"
```

## Build Script

The CLI includes a build script for development:

```bash
# Build for local platform
./build.sh local

# Build for all platforms
./build.sh all

# Clean previous builds
./build.sh clean

# Test the build
./build.sh test

# Install locally
./build.sh install
```

## Output Files

### Build Artifacts

**Release Mode:**

- App Bundle: `src-tauri/target/release/bundle/macos/Container Kit.app`
- DMG Image: `src-tauri/target/release/bundle/dmg/Container Kit_*.dmg`

**Debug Mode:**

- App Bundle: `src-tauri/target/debug/bundle/macos/Container Kit.app`
- DMG Image: `src-tauri/target/debug/bundle/dmg/Container Kit_*.dmg`

## Examples

### Complete Build Workflow

```bash
# 1. Check migration status (if you have SQL files)
container-kit-cli migration status

# 2. Generate migrations if needed
container-kit-cli migration generate

# 3. Build for production
container-kit-cli build --mode release
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Build Container Kit CLI
  run: |
      cd cli
      go build -o container-kit-cli .

- name: Generate migrations and build
  run: |
      ./cli/container-kit-cli migration generate
      ./cli/container-kit-cli build --verbose
```

## Troubleshooting

### Common Issues

1. **"Not a valid Tauri project"**

    - Ensure you're in the project root directory
    - Check that `src-tauri/tauri.conf.json` exists

2. **Build failures**

    - Ensure all dependencies are installed (Node.js, Rust, pnpm)
    - Check that you're in a valid Tauri project directory
    - Use `--verbose` flag for detailed error information

3. **Migration errors**
    - Validate SQL syntax in migration files
    - Use `container-kit-cli migration validate`
    - Check file naming format: `NNNN_description.sql`

### Debug Mode

Enable verbose output for detailed information:

```bash
container-kit-cli [command] --verbose
```

## Development

### Building from Source

```bash
# Clone and build
git clone https://github.com/your-org/container-kit.git
cd container-kit/cli

# Install dependencies
go mod tidy

# Build
go build -o container-kit-cli .

# Test
./container-kit-cli --help
```

### Project Structure

```
cli/
├── cmd/                 # Command implementations
│   ├── build.go        # Build command
│   ├── migration.go    # Migration commands
│   └── root.go         # Root command
├── main.go             # Entry point
├── go.mod              # Go dependencies
├── build.sh            # Build script
└── README.md           # This file
```

## License

[Your License Here]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and support:

- Create an issue on GitHub
- Check the troubleshooting section above
- Review the verbose output for error details
