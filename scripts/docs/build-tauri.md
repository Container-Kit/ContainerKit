# Tauri Build Script Documentation

This script handles the complete Tauri application build process including dependency preparation, frontend compilation, backend compilation, and build artifact validation. This script is focused solely on building the application without creating release bundles.

## Overview

This script performs the Tauri build workflow:
1. Pre-flight checks (project structure, tools, environment)
2. Dependencies preparation (pnpm install, database generation)
3. Tauri application build (includes frontend build automatically)
4. Build artifact validation
5. Build summary report

## Usage

### Basic Usage

```bash
# Basic build with defaults
tsx scripts/build-tauri.ts

# Override version
tsx scripts/build-tauri.ts -v 1.0.0

# Skip dependency preparation
tsx scripts/build-tauri.ts --skip-deps

# Build for different target
tsx scripts/build-tauri.ts -t universal-apple-darwin

# Show help
tsx scripts/build-tauri.ts -h
```

### NPM Scripts

```bash
# Build Tauri app
pnpm build:tauri

# Build without dependency preparation
pnpm build:tauri:skip-deps

# Show help
pnpm build:tauri:help
```

## Command Line Options

| Option | Short | Description | Default | Example |
|--------|-------|-------------|---------|---------|
| `--version` | `-v` | Override version | Read from `tauri.conf.json` | `-v 1.2.0` |
| `--target` | `-t` | Build target architecture | `aarch64-apple-darwin` | `-t universal-apple-darwin` |
| `--skip-deps` | | Skip dependency preparation | `false` | `--skip-deps` |
| `--help` | `-h` | Show help message | N/A | `-h` |

## Prerequisites

### Required Files

1. **Configuration Files**:
   - `src-tauri/tauri.conf.json` (for version and build configuration)
   - `package.json` (project validation)
   - `.env` (environment variables for signing)

2. **Project Structure**:
   - Valid Tauri project structure
   - Frontend source files
   - Backend Rust source files in `src-tauri/`

### Required Tools

- **Node.js** (v22 or later)
- **pnpm** (package manager)
- **Rust** (for Tauri backend)
- **Tauri CLI** (`cargo install tauri-cli`)

### Environment Variables

Required for app signing:
- `TAURI_SIGNING_PRIVATE_KEY` - Private key for code signing
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` - Password for private key

## Script Workflow

### 1. Argument Parsing
- Processes command line arguments
- Sets default values from configuration
- Validates options and shows help if requested

### 2. Pre-flight Checks
- **Project Structure Validation**: Ensures required files exist
- **Tool Availability**: Verifies Node.js, pnpm, Rust, Tauri CLI
- **Environment Check**: Validates environment variables and configuration

### 3. Dependencies Preparation (unless skipped)
- **Package Installation**: Runs `pnpm install` to install Node.js dependencies
- **Database Generation**: Executes `pnpm db:generate` for database artifacts
- **Validation**: Ensures all dependencies are properly installed

### 4. Tauri Application Build
- **Environment Loading**: Loads signing keys and other environment variables
- **Frontend Build**: Automatically built as part of Tauri build process
- **Backend Build**: Compiles Rust backend with optimizations
- **Bundle Creation**: Creates DMG, app bundle, and signature files

### 5. Build Artifact Validation
- **File Existence**: Verifies all expected build outputs exist
- **Structure Validation**: Checks directory structure and file organization
- **Integrity Checks**: Ensures files are accessible and properly formatted

### 6. Build Summary
- **Build Information**: Shows version, target, and build directory
- **File Listing**: Lists all created artifacts with sizes
- **Next Steps**: Provides guidance for subsequent actions

## Generated Build Artifacts

### Build Directory Structure
```
src-tauri/target/{target}/release/bundle/
├── dmg/
│   └── Container Kit_{version}_{target}.dmg     # DMG installer
└── macos/
    ├── Container Kit.app/                       # Uncompressed app bundle
    ├── Container Kit.app.tar.gz                 # Compressed app bundle
    └── Container Kit.app.tar.gz.sig             # Cryptographic signature
```

### Artifact Types

1. **DMG Installer** (`Container Kit_{version}_{target}.dmg`)
   - Traditional macOS installer package
   - Contains the complete application
   - Ready for distribution to end users

2. **App Bundle Directory** (`Container Kit.app/`)
   - Complete macOS application bundle
   - Uncompressed for development and testing
   - Contains all resources and binaries

3. **Compressed App Bundle** (`Container Kit.app.tar.gz`)
   - Compressed version of the app bundle
   - Used by the auto-updater system
   - Smaller download size for updates

4. **Signature File** (`Container Kit.app.tar.gz.sig`)
   - Cryptographic signature for the compressed bundle
   - Ensures update authenticity and integrity
   - Required for secure auto-updates

## Configuration

### Version Source
Version is read from `src-tauri/tauri.conf.json` unless overridden with the `-v` option.

### Build Targets
Default target is `aarch64-apple-darwin` (Apple Silicon). Other supported targets:
- `x86_64-apple-darwin` (Intel Mac)
- `universal-apple-darwin` (Universal binary)

### Environment Variables
The script automatically loads environment variables from `.env` file for:
- Code signing configuration
- Build-specific settings
- Development vs production flags

## Error Handling

### Common Errors

#### Missing Tools
```
❌ Required tool not found: tauri
ℹ️  Install with: cargo install tauri-cli
```
**Solution**: Install missing tools as indicated.

#### Environment Configuration
```
❌ Environment check failed: .env file not found
⚠️  Signing keys may not be configured
```
**Solution**: Create `.env` file with required signing configuration.

#### Build Failures
```
❌ Tauri build failed - target directory not found
```
**Solutions**:
- Check Rust compilation errors
- Verify frontend build succeeds
- Ensure all dependencies are installed

#### Dependency Issues
```
❌ Command failed: pnpm install
```
**Solutions**:
- Check internet connectivity
- Clear `node_modules` and `pnpm-lock.yaml`
- Run `pnpm install` manually to see detailed errors

### Debug Mode
Add debug logging by setting environment variable:
```bash
DEBUG=1 tsx scripts/build-tauri.ts
```

## TypeScript Interface Definitions

### Core Types
```typescript
interface BuildOptions {
    version?: string;
    skipDependencies: boolean;
    target: string;
}

interface Config {
    domain: string;
    projectRoot: string;
    tauriConf: string;
    bundleDir: string;
    packageJson: string;
}
```

## Integration with Other Scripts

### With copy-build-files-to-release.ts
After successful build, use copy script to create release bundles:
```bash
tsx scripts/build-tauri.ts
tsx scripts/copy-build-files-to-release.ts
```

### With build-and-copy-to-release.ts
The orchestrator script uses build-tauri.ts as a component:
```bash
tsx scripts/build-and-copy-to-release.ts
# Internally calls: build-tauri.ts → copy-build-files-to-release.ts
```

## Best Practices

### Before Building
1. Ensure all source code changes are committed
2. Update version in `tauri.conf.json` if needed
3. Test frontend and backend independently
4. Verify signing keys are properly configured

### After Building
1. Test the generated application locally
2. Verify all expected artifacts were created
3. Check file sizes and signatures
4. Consider creating release bundles for distribution

### Development Workflow
1. Use `--skip-deps` for faster iteration during development
2. Build with different targets for testing compatibility
3. Validate build artifacts before creating releases

## Performance Optimization

### Build Speed
- Use `--skip-deps` when dependencies haven't changed
- Consider incremental builds for development
- Utilize build caching when available

### Resource Usage
- Build process is CPU and memory intensive
- Ensure adequate disk space for artifacts
- Consider build parallelization options

## Security Considerations

### Code Signing
- Never commit signing keys to version control
- Use environment variables for sensitive configuration
- Rotate signing keys periodically
- Verify signatures after build completion

### Build Environment
- Use clean, controlled build environments for releases
- Validate all dependencies and tools
- Scan build artifacts for security issues

## Troubleshooting

### Manual Verification
```bash
# Check build artifacts
find src-tauri/target -name "*.dmg" -o -name "*.app" -o -name "*.tar.gz"

# Verify app bundle structure
ls -la "src-tauri/target/aarch64-apple-darwin/release/bundle/macos/Container Kit.app"

# Check signatures
file "src-tauri/target/aarch64-apple-darwin/release/bundle/macos/Container Kit.app.tar.gz.sig"
```

### Recovery Steps
If the build fails partway through:
1. Check error messages for specific issues
2. Fix underlying problems (dependencies, environment, etc.)
3. Clean build artifacts if needed: `cargo clean`
4. Re-run with debug mode for detailed logging
5. Try building individual components separately

## Contributing

When modifying this script:
1. Maintain TypeScript type safety
2. Update documentation for any new options
3. Add appropriate error handling and user feedback
4. Test with different build targets and configurations
5. Ensure compatibility with orchestrator scripts
