# Shared Utilities Documentation

The `scripts/utils/shared.ts` module contains common functions, types, and configurations used by all developer build automation scripts: `build-tauri.ts`, `copy-build-files-to-release.ts`, and `build-and-copy-to-release.ts`. This shared approach eliminates code duplication and ensures consistency across the entire developer script ecosystem.

## Overview

The shared utilities module provides:

- **Type definitions** for consistent data structures across all developer scripts
- **Build functions** used by `build-tauri.ts` for development compilation workflows
- **Copy functions** used by `copy-build-files-to-release.ts` for developer build packaging
- **Orchestration functions** used by `build-and-copy-to-release.ts` for developer workflow coordination
- **Common functions** for file operations, validation, and processing
- **Configuration management** with centralized developer settings
- **Error handling** with standardized messaging and recovery patterns
- **Platform-specific operations** for macOS development artifacts

## Architecture

### Module Structure

```
scripts/utils/shared.ts
├── Types and Interfaces     # TypeScript definitions for all scripts
├── Constants               # Configuration, colors, and shared settings
├── Build Functions         # Used by build-tauri.ts
│   ├── validateProjectStructure()
│   ├── checkRequiredTools()
│   ├── checkEnvironment()
│   ├── loadEnvironmentVariables()
│   └── executeCommand()
├── Copy Functions          # Used by copy-build-files-to-release.ts
│   ├── checkBuildArtifacts()
│   ├── createBundleStructure()
│   ├── copyArtifacts()
│   ├── createUpdateManifest()
│   ├── updateIndex()
│   └── validateBundle()
├── Utility Functions       # Shared across all scripts
│   ├── getVersion()
│   ├── getFileSize()
│   ├── formatBytes()
│   ├── urlEncode()
│   └── processTemplate()
├── File Operations         # Core file system operations
├── Validation             # Integrity and consistency checks
└── Process Management      # Error handling, interrupts, logging
```

## Types and Interfaces

### Core Configuration

```typescript
interface Config {
    domain: string; // Default development domain
    projectRoot: string; // Project root directory
    tauriConf: string; // Path to tauri.conf.json (version source)
    bundleDir: string; // Developer build directory path
    packageJson: string; // Path to package.json
}
```

### Script-Specific Options

```typescript
interface BuildOptions {
    version?: string; // Override version from tauri.conf.json
    skipDependencies: boolean;
    target: string; // Build target (aarch64-apple-darwin, etc.)
}

interface CopyOptions {
    domain: string; // Development/staging domain
    version?: string; // Override version from tauri.conf.json
    force: boolean; // Overwrite existing artifacts
}

interface ReleaseOptions {
    domain: string; // Development/staging domain
    version?: string; // Override version from tauri.conf.json
    force: boolean; // Overwrite existing artifacts
    skipBuild: boolean; // Skip Tauri build step
    skipDependencies: boolean; // Skip dependency installation
    skipCopy: boolean; // Skip artifact copying
    target: string; // Build target architecture
}
```

### Build Artifacts

```typescript
interface BuildArtifacts {
    dmg: string; // DMG installer path for distribution
    appBundle: string; // Compressed app bundle
    signature: string; // Cryptographic signature
    appDir: string; // Uncompressed app directory
}
```

### Update Manifest

```typescript
interface UpdateManifest {
    version: string;
    notes: string;
    pub_date: string;
    platforms: {
        'darwin-aarch64': {
            signature: string;
            url: string;
        };
    };
}
```

### Bundle Index

```typescript
interface BundleIndex {
    name: string;
    description: string;
    latest_version: string;
    versions: Record<string, VersionInfo>;
    updater: {
        endpoint: string;
        public_key: string;
    };
    metadata: {
        created: string;
        last_updated: string;
        bundle_format_version: string;
    };
}
```

## Configuration Functions

### getConfig()

Returns the default configuration object with computed paths.

```typescript
const config = getConfig();
// {
//   domain: 'https://container-kit.ethercorps.io/release',
//   projectRoot: '/path/to/project',
//   tauriConf: '/path/to/src-tauri/tauri.conf.json',
//   bundleDir: '/path/to/release',
//   packageJson: '/path/to/package.json'
// }
```

**Usage**: Called at the start of scripts to get consistent configuration.

## Utility Functions

### Version Management

#### getVersion(overrideVersion?: string): string

Extracts version from `tauri.conf.json` or uses provided override.

```typescript
// Read from tauri.conf.json
const version = getVersion();

// Use override
const version = getVersion('1.0.0');
```

**Error Handling**: Exits process if version cannot be determined.

### Time and Formatting

#### getTimestamp(): string

Returns current timestamp in ISO format.

```typescript
const timestamp = getTimestamp();
// "2025-01-21T18:30:00.000Z"
```

#### formatBytes(bytes: number): string

Converts bytes to human-readable format.

```typescript
formatBytes(1024); // "1 KB"
formatBytes(1048576); // "1 MB"
formatBytes(7821591); // "7.46 MB"
```

#### urlEncode(str: string): string

Encodes spaces and special characters for URLs.

```typescript
urlEncode('Container Kit.app.tar.gz');
// "Container%20Kit.app.tar.gz"
```

### File Operations

#### getFileSize(filePath: string): number

Returns file size in bytes, or 0 if file doesn't exist.

```typescript
const size = getFileSize('/path/to/file.dmg');
// 7821591
```

#### copyFileSync(src: string, dest: string): void

Copies a file with error handling and process exit on failure.

```typescript
copyFileSync('/source/file.dmg', '/dest/file.dmg');
```

#### copyDirSync(src: string, dest: string): void

Recursively copies a directory with error handling.

```typescript
copyDirSync('/source/Container Kit.app', '/dest/Container Kit.app');
```

## Build and Validation Functions

### checkBuildArtifacts(version: string): BuildArtifacts

Validates that all required Tauri build artifacts exist and returns their paths.

```typescript
const artifacts = checkBuildArtifacts('0.2.0');
// Returns: { dmg: '...', appBundle: '...', signature: '...', appDir: '...' }
```

**Validation**: Checks for DMG, app bundle, signature, and app directory.

**Error Handling**: Exits with helpful message if any artifacts are missing.

### createBundleStructure(version: string, force: boolean): object

Creates the release directory structure for a specific version.

```typescript
const { versionDir, macosDir } = createBundleStructure('0.2.0', false);
// Creates: release/0.2.0/macos/
```

**Force Option**: Overwrites existing directories if `force` is true.

### copyArtifacts(version: string, artifacts: BuildArtifacts, macosDir: string): void

Copies all build artifacts to the release directory.

```typescript
copyArtifacts('0.2.0', artifacts, '/path/to/release/0.2.0/macos');
```

**Operations**:

- Copies DMG file for developer distribution
- Copies compressed app bundle and signature for testing
- Recursively copies app directory for development
- Preserves file permissions and metadata

## Manifest Generation

### createUpdateManifest(version: string, versionDir: string, domain: string): void

Creates the `update.json` manifest for Tauri updater.

```typescript
createUpdateManifest('0.2.0', '/path/to/release/0.2.0', 'https://domain.com');
```

**Generated Content**:

- Version information
- Release notes
- Publication timestamp
- Platform-specific download URLs and signatures

### updateIndex(version: string, domain: string): void

Updates or creates the master `index.json` file.

```typescript
updateIndex('0.2.0', 'https://domain.com');
```

**Features**:

- Backs up existing index
- Updates latest version
- Adds new version metadata
- Includes download statistics

## Validation Functions

### validateBundle(version: string): void

Validates the integrity of a created release bundle.

```typescript
validateBundle('0.2.0');
```

**Checks**:

- All required development files exist
- JSON files are valid for testing
- Directory structure is correct for deployment
- File sizes match development expectations

### validateProjectStructure(): void

Ensures the script is running in a valid Tauri project.

```typescript
validateProjectStructure();
```

**Validation**:

- `tauri.conf.json` exists
- `package.json` exists
- Proper directory structure

### checkRequiredTools(): void

Verifies that all required development tools are available.

```typescript
checkRequiredTools();
```

**Tools Checked**:

- Node.js
- pnpm
- Tauri CLI

## Environment Management

### checkEnvironment(): void

Checks for environment configuration files.

```typescript
checkEnvironment();
```

**Checks**:

- `.env` file existence
- Warns if signing keys might be missing

### loadEnvironmentVariables(): void

Loads variables from `.env` file into process environment.

```typescript
loadEnvironmentVariables();
```

**Variables Loaded**:

- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- Any other environment variables

## Command Execution

### executeCommand(command: string, description: string, cwd?: string): void

Executes shell commands with error handling and progress feedback.

```typescript
executeCommand('pnpm build', 'Building frontend');
executeCommand('tauri build', 'Building Tauri app', '/custom/directory');
```

**Features**:

- Progress indication
- Error handling with process exit
- Inherits environment variables
- Customizable working directory

## Display and Feedback

### Print Functions

Standardized console output with color coding:

```typescript
print.info('Information message'); // Blue with ℹ️
print.success('Success message'); // Green with ✅
print.warning('Warning message'); // Yellow with ⚠️
print.error('Error message'); // Red with ❌
print.step('Step in progress'); // Cyan with 🔄
print.header('Section Header'); // Magenta with decorative border
```

### showBundleSummary(version: string, domain: string): void

Displays a comprehensive summary after bundle creation.

```typescript
showBundleSummary('0.2.0', 'https://domain.com');
```

**Output Includes**:

- Version and directory information
- File sizes
- Download URLs
- Next steps for deployment

## Process Management

### setupInterruptHandlers(): void

Configures graceful handling of process interruptions.

```typescript
setupInterruptHandlers();
```

**Handlers**:

- `SIGINT` (Ctrl+C) - Clean exit with message
- `uncaughtException` - Error logging and exit
- `unhandledRejection` - Promise rejection handling

### isMainModule(importMetaUrl: string): boolean

Determines if the current module is being run directly (ES module compatible).

```typescript
if (isMainModule(import.meta.url)) {
    main();
}
```

## Usage Patterns

### Script Initialization

Standard pattern for script setup:

```typescript
import { getConfig, setupInterruptHandlers, validateProjectStructure } from './utils/shared.js';

const config = getConfig();
setupInterruptHandlers();

function main() {
    validateProjectStructure();
    // ... script logic
}
```

### Build Artifact Processing

Common pattern for handling developer build outputs:

```typescript
import { checkBuildArtifacts, createBundleStructure, copyArtifacts } from './utils/shared.js';

const artifacts = checkBuildArtifacts(version); // Version from tauri.conf.json
const { versionDir, macosDir } = createBundleStructure(version, force);
copyArtifacts(version, artifacts, macosDir); // Copy for development testing
```

### Manifest Generation

Standard pattern for creating developer manifests:

```typescript
import { createUpdateManifest, updateIndex, validateBundle } from './utils/shared.js';

createUpdateManifest(version, versionDir, domain); // Version from tauri.conf.json
updateIndex(version, domain); // Update development index
validateBundle(version); // Validate for development deployment
```

## Error Handling Philosophy

The shared utilities follow a consistent error handling approach:

1. **Fail Fast**: Exit immediately on critical errors
2. **Descriptive Messages**: Clear error descriptions with solutions
3. **Graceful Degradation**: Warnings for non-critical issues
4. **Process Exit**: Use appropriate exit codes for automation

### Error Message Format

```
❌ {Error Description}
ℹ️  {Helpful Solution or Next Steps}
```

## Extension Guidelines

When adding new shared utilities:

1. **Type Safety**: Use TypeScript interfaces for all data structures
2. **Error Handling**: Include comprehensive error handling with helpful messages
3. **Documentation**: Add JSDoc comments for all public functions
4. **Consistency**: Follow existing naming and structure patterns
5. **Testing**: Consider edge cases and error conditions

## Dependencies

The shared utilities module uses only Node.js built-in modules:

- `fs` - File system operations
- `path` - Path manipulation
- `child_process` - Command execution
- `url` - URL parsing for ES modules

This minimizes external dependencies and ensures reliability.

## Performance Considerations

- **File Operations**: Uses synchronous operations for simplicity and error handling
- **Memory Usage**: Streams large files where possible
- **Process Management**: Efficient command execution with proper cleanup
- **Validation**: Early validation to prevent expensive operations on invalid data

## Security Notes

- **Environment Variables**: Safely loads sensitive data from `.env`
- **File Permissions**: Preserves file permissions during copy operations
- **Path Validation**: Prevents directory traversal attacks
- **Command Injection**: Uses safe command execution patterns
