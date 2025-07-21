# Complete Build Workflow Orchestrator

This script is a comprehensive orchestrator that combines the functionality of `build-tauri.ts` and `copy-build-files-to-release.ts` into a single, streamlined developer workflow. This script provides a complete end-to-end build process from building the Tauri application to creating deployment-ready development artifacts for testing and distribution.

## Overview

This script orchestrates the complete developer build workflow by:

1. Executing the Tauri build process (via `build-tauri.ts`) with version from `src-tauri/tauri.conf.json`
2. Copying build artifacts to release structure (via `copy-build-files-to-release.ts`)
3. Generating comprehensive build summaries for developers

## Usage

### Basic Usage

```bash
# Complete developer build workflow (version from tauri.conf.json)
tsx scripts/build-and-copy-to-release.ts

# Override version (otherwise uses tauri.conf.json)
tsx scripts/build-and-copy-to-release.ts -v 1.0.0

# Custom domain for development URLs
tsx scripts/build-and-copy-to-release.ts -d https://dev.mydomain.com

# Force overwrite existing build artifacts
tsx scripts/build-and-copy-to-release.ts -f

# Skip build step (only copy existing artifacts for testing)
tsx scripts/build-and-copy-to-release.ts --skip-build

# Skip copy step (build only for development)
tsx scripts/build-and-copy-to-release.ts --skip-copy

# Skip dependency preparation (faster development iteration)
tsx scripts/build-and-copy-to-release.ts --skip-deps

# Build for different target architecture
tsx scripts/build-and-copy-to-release.ts -t universal-apple-darwin

# Show help
tsx scripts/build-and-copy-to-release.ts -h
```

### NPM Scripts

```bash
# Complete developer build workflow (version from tauri.conf.json)
pnpm release

# Force overwrite existing build artifacts
pnpm release:force

# Skip build step (only copy existing artifacts)
pnpm release:skip-build

# Skip copy step (build only for development)
pnpm release:skip-copy

# Show help
pnpm release:help
```

## Command Line Options

| Option         | Short | Description                        | Default                                       | Example                     |
| -------------- | ----- | ---------------------------------- | --------------------------------------------- | --------------------------- |
| `--version`    | `-v`  | Override version                   | Read from `src-tauri/tauri.conf.json`         | `-v 1.2.0`                  |
| `--domain`     | `-d`  | Domain for development URLs        | `https://container-kit.ethercorps.io/release` | `-d https://dev.app.com`    |
| `--target`     | `-t`  | Build target architecture          | `aarch64-apple-darwin`                        | `-t universal-apple-darwin` |
| `--force`      | `-f`  | Force overwrite existing artifacts | `false`                                       | `-f`                        |
| `--skip-build` |       | Skip the Tauri build step          | `false`                                       | `--skip-build`              |
| `--skip-deps`  |       | Skip dependency preparation        | `false`                                       | `--skip-deps`               |
| `--skip-copy`  |       | Skip copying files to release      | `false`                                       | `--skip-copy`               |
| `--help`       | `-h`  | Show help message                  | N/A                                           | `-h`                        |

## Prerequisites

### Required Files

1. **Project Configuration**:

    - `src-tauri/tauri.conf.json` (primary version source and build configuration)
    - `package.json` (project validation)
    - `.env` (environment variables for development signing)

2. **Project Structure**:
    - Valid Tauri project structure for development
    - Frontend source files for compilation
    - Backend Rust source files in `src-tauri/`

### Required Tools

- **Node.js** (v22 or later)
- **pnpm** (package manager)
- **Rust** (for Tauri backend)
- **Tauri CLI** (`cargo install tauri-cli`)
- **tsx** (TypeScript execution)

### Environment Variables

Required for development app signing:

- `TAURI_SIGNING_PRIVATE_KEY` - Private key for development code signing
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` - Password for private key

## Workflow Orchestration

### 1. Argument Parsing and Validation

- Processes command line arguments from user input
- Validates option combinations and dependencies
- Sets up configuration for both build and copy operations
- Shows help and usage information when requested

### 2. Workflow Planning

- Displays planned execution steps based on options
- Shows which operations will be performed or skipped
- Provides confirmation prompt before execution
- Estimates time and resource requirements

### 3. Build Phase (unless --skip-build)

**Orchestrates `build-tauri.ts` with configured options:**

- Passes through version, target, and dependency settings
- Handles build-specific error conditions
- Monitors build progress and provides feedback
- Validates successful completion before proceeding

**Build Operations Include:**

- Pre-flight checks (tools, environment, project structure)
- Dependencies preparation (unless --skip-deps)
- Tauri application compilation (frontend + backend)
- Build artifact validation and verification

### 4. Copy Phase (unless --skip-copy)

**Orchestrates `copy-build-files-to-release.ts` with configured options:**

- Passes through version, domain, and force settings
- Manages release directory structure creation
- Handles copy-specific error conditions
- Validates release bundle completeness

**Copy Operations Include:**

- Build artifact validation and copying
- Release directory structure creation
- Update manifest generation (update.json)
- Master index management (index.json)
- Documentation generation (README.md)

### 5. Final Validation and Summary

- Comprehensive validation of complete release
- File integrity and accessibility checks
- Release summary with deployment information
- Next steps and deployment guidance

## Generated Output

### During Build Phase

```
src-tauri/target/{target}/release/bundle/
├── dmg/
│   └── Container Kit_{version}_{target}.dmg
└── macos/
    ├── Container Kit.app/
    ├── Container Kit.app.tar.gz
    └── Container Kit.app.tar.gz.sig
```

### During Copy Phase

```
release/
├── README.md                           # Auto-generated documentation
├── index.json                          # Master version index
└── {version}/                          # Version-specific directory
    ├── update.json                     # Tauri updater manifest
    └── macos/                          # macOS artifacts
        ├── Container Kit.app.tar.gz    # Compressed app for updates
        ├── Container Kit.app.tar.gz.sig # Cryptographic signature
        ├── Container Kit.app/          # Uncompressed app directory
        └── Container Kit_{version}_{target}.dmg # DMG installer
```

## Configuration

### Script Integration

The orchestrator manages configuration for both component scripts:

**Build Configuration:**

- Version detection and validation
- Target architecture selection
- Dependency management settings
- Environment variable handling

**Copy Configuration:**

- Domain URL management
- Force overwrite behavior
- Release directory structure
- Manifest generation settings

### Shared State Management

- Passes consistent configuration between scripts
- Maintains error state across operations
- Preserves user preferences throughout workflow
- Handles interruption and recovery scenarios

## Error Handling

### Build Phase Errors

#### Tool or Environment Issues

```
❌ Tauri build failed: Required tool not found: tauri
ℹ️  Install with: cargo install tauri-cli
```

**Recovery**: The orchestrator stops execution and provides installation guidance.

#### Dependency Problems

```
❌ Tauri build failed: Command failed: pnpm install
```

**Recovery**: Check network connectivity, clear caches, try manual installation.

#### Compilation Failures

```
❌ Tauri build failed: Build artifacts not found
```

**Recovery**: Check Rust/frontend compilation errors, fix code issues, retry.

### Copy Phase Errors

#### Missing Artifacts

```
❌ Copy build files failed: DMG file not found
ℹ️  Build phase may have failed
```

**Recovery**: Ensure build completed successfully, check artifact paths.

#### Release Conflicts

```
❌ Copy build files failed: Bundle for version 1.0.0 already exists
ℹ️  Use --force to overwrite or increment version
```

**Recovery**: Use `--force` flag or update version in configuration.

### Orchestration Errors

#### Invalid Option Combinations

```
❌ Cannot skip both build and copy phases
```

**Recovery**: Specify valid operation combination.

#### Configuration Conflicts

```
❌ Version mismatch between build and copy operations
```

**Recovery**: Ensure consistent version across all operations.

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
DEBUG=1 tsx scripts/build-and-copy-to-release.ts
```

## Advanced Usage Patterns

### Development Workflow

```bash
# Fast iteration during development
tsx scripts/build-and-copy-to-release.ts --skip-deps -f

# Test different release configurations
tsx scripts/build-and-copy-to-release.ts --skip-build -d https://test.domain.com

# Build for multiple targets
tsx scripts/build-and-copy-to-release.ts -t x86_64-apple-darwin
tsx scripts/build-and-copy-to-release.ts -t aarch64-apple-darwin --skip-deps
```

### CI/CD Integration

```bash
# Automated release pipeline
tsx scripts/build-and-copy-to-release.ts -v $RELEASE_VERSION -d $DEPLOYMENT_DOMAIN

# Separate build and deploy stages
tsx scripts/build-and-copy-to-release.ts --skip-copy  # Build stage
tsx scripts/build-and-copy-to-release.ts --skip-build -d $PROD_DOMAIN  # Deploy stage
```

### Development Releases

```bash
# Complete development release
tsx scripts/build-and-copy-to-release.ts -v 1.0.0 -d https://dev.myapp.com

# Development patch build
tsx scripts/build-and-copy-to-release.ts -v 1.0.1 -f
```

## TypeScript Interface Definitions

### Core Types

```typescript
interface ReleaseOptions {
    domain: string;
    version?: string;
    force: boolean;
    skipBuild: boolean;
    skipDependencies: boolean;
    skipCopy: boolean;
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

### Script Orchestration

```typescript
async function executeBuildTauri(
    version: string,
    target: string,
    skipDependencies: boolean
): Promise<void>;

async function executeCopyBuildFiles(
    version: string,
    domain: string,
    force: boolean
): Promise<void>;
```

## Integration Points

### With Individual Scripts

The orchestrator imports and executes the main functions from component scripts:

```typescript
import { main as buildTauriMain } from './build-tauri.js';
import { main as copyBuildFilesMain } from './copy-build-files-to-release.js';
```

### With External Tools

- **pnpm**: Package management and script execution
- **Tauri CLI**: Application building and bundling
- **Cargo**: Rust compilation and dependency management
- **TypeScript**: Script execution and type checking

### With CI/CD Systems

- Exit codes indicate success/failure for automation
- Comprehensive logging for build system integration
- Environment variable support for configuration
- Scriptable options for automated workflows

## Performance Considerations

### Build Optimization

- Dependency caching with `--skip-deps` option
- Incremental builds when possible
- Parallel operations where supported
- Resource usage monitoring

### Copy Optimization

- Efficient file operations for large artifacts
- Incremental manifest updates
- Optimized directory structure creation
- Minimal redundant operations

### Memory and Disk Usage

- Monitors disk space requirements
- Manages temporary file cleanup
- Optimizes memory usage during large file operations
- Provides progress feedback for long operations

## Security Considerations

### Code Signing

- Secure handling of signing keys throughout workflow
- Validation of signatures at each step
- Protection of sensitive environment variables
- Audit trail for release operations

### Build Integrity

- Verification of build artifacts before release
- Validation of file integrity during copying
- Secure handling of release manifests
- Protection against tampering

### Network Security

- HTTPS enforcement for release domains
- URL validation and sanitization
- Secure manifest generation
- Protection of update endpoints

## Best Practices

### Before Running

1. **Version Management**: Update version in `tauri.conf.json`
2. **Code Quality**: Ensure all tests pass and code is committed
3. **Environment Setup**: Verify signing keys and environment variables
4. **Resource Planning**: Ensure adequate disk space and build time

### During Execution

1. **Monitoring**: Watch for error messages and warnings
2. **Validation**: Verify each phase completes successfully
3. **Interruption**: Use Ctrl+C for clean cancellation if needed
4. **Progress**: Monitor build and copy progress indicators

### After Completion

1. **Testing**: Test the generated application locally
2. **Validation**: Verify all release files and manifests
3. **Deployment**: Upload release directory to web server
4. **Documentation**: Update release notes and changelogs

### Version Control

1. **Tagging**: Tag releases in version control
2. **Branching**: Use release branches for production builds
3. **Artifacts**: Store release manifests in version control
4. **Documentation**: Maintain release history and notes

## Troubleshooting

### Common Issues

#### Workflow Stops at Build Phase

1. Check tool installations (Node.js, Rust, Tauri CLI)
2. Verify environment variables are set correctly
3. Review frontend and backend compilation errors
4. Ensure dependencies are properly installed

#### Workflow Stops at Copy Phase

1. Verify build artifacts exist and are accessible
2. Check release directory permissions
3. Ensure no conflicting version directories exist
4. Validate manifest generation requirements

#### Inconsistent Results

1. Use `--force` to overwrite existing releases
2. Clear build caches and temporary files
3. Ensure consistent version across all operations
4. Verify environment variables are properly set

### Recovery Procedures

#### Partial Completion

If the workflow fails partway through:

1. Identify the specific failure point from error messages
2. Fix the underlying issue (permissions, dependencies, etc.)
3. Use appropriate skip flags to resume from the failed point
4. Verify the complete workflow after recovery

#### Cleanup and Retry

For complete cleanup and retry:

```bash
# Clean build artifacts
cargo clean

# Remove partial release
rm -rf release/{version}

# Retry complete workflow
tsx scripts/build-and-copy-to-release.ts -f
```

## Monitoring and Logging

### Progress Indicators

- Phase-specific progress reporting
- File operation progress for large artifacts
- Build compilation progress monitoring
- Overall workflow completion percentage

### Error Reporting

- Detailed error messages with context
- Suggested solutions for common issues
- Stack traces for debugging (in debug mode)
- Exit codes for automation integration

### Success Metrics

- Build time and resource usage statistics
- File sizes and artifact information
- Release validation results
- Deployment readiness indicators

## Contributing

When modifying this orchestrator script:

### Code Quality

1. Maintain TypeScript type safety throughout
2. Add comprehensive error handling for new features
3. Update documentation for any new options or behaviors
4. Test with various configuration combinations

### Integration Testing

1. Test with both component scripts individually
2. Verify error propagation and handling
3. Test skip options and workflow variations
4. Validate CI/CD integration scenarios

### Documentation Updates

1. Update this documentation for new features
2. Update component script documentation as needed
3. Add examples for new usage patterns
4. Maintain troubleshooting section completeness

## Related Documentation

- **[build-tauri.md](./build-tauri.md)** - Build component documentation
- **[copy-to-release.md](./copy-to-release.md)** - Copy component documentation
- **[shared-utils.md](./shared-utils.md)** - Shared utilities documentation
- **[quick-reference.md](./quick-reference.md)** - Command quick reference
- **[template-system.md](./template-system.md)** - Template system documentation
