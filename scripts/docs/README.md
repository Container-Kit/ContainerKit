# Container Kit Scripts Documentation

This directory contains comprehensive documentation for all Container Kit scripts and utilities. The documentation is organized to help developers understand, use, and maintain the development and release automation systems. All documentation is focused on developers working with the Container Kit codebase.

## 📚 Documentation Overview

### Core Script Documentation

- **[build-and-copy-to-release.md](./build-and-copy-to-release.md)** - Complete release workflow orchestrator.
- **[build-tauri.md](./build-tauri.md)** - Tauri application build script.
- **[copy-to-release.md](./copy-to-release.md)** - Build files copy script.
- **[generate-migrations.md](./generate-migrations.md)** - Database migration generator for rust.
- **[shared-utils.md](./shared-utils.md)** - Shared utilities module.
- **[template-system.md](./template-system.md)** - Template system documentation.

### Process and Workflow Guides

- **[quick-reference.md](./quick-reference.md)** - Command quick reference

## 🗂️ Script Architecture

### File Structure

```
scripts/
├── build-and-copy-to-release.ts        # Complete release workflow (orchestrator)
├── build-tauri.ts                      # Tauri application build only
├── copy-build-files-to-release.ts      # Copy build files to release directories
├── generate-migrations.ts              # Database migration generator
├── docs/                               # Documentation directory
│   ├── README.md                       # This file
│   ├── build-and-copy-to-release.md    # Complete workflow docs
│   ├── build-tauri.md                  # Build script docs
│   ├── copy-to-release.md              # Copy script docs
│   ├── generate-migrations.md          # Migration generator docs
│   ├── quick-reference.md              # Quick reference
│   ├── shared-utils.md                 # Utilities docs
│   └── template-system.md              # Template system docs
├── templates/                          # Template files
│   └── copy-build-files-to-release.template.md
└── utils/
    └── shared.ts                       # Shared utilities module
```

## 🚀 Script Responsibilities

### build-and-copy-to-release.ts

**Purpose**: Complete release workflow orchestrator that combines build and copy operations

**Key Functions**:

- Orchestrates `build-tauri.ts` execution with configured options
- Orchestrates `copy-build-files-to-release.ts` execution with configured options
- Provides unified command-line interface for complete developer releases
- Manages workflow state and comprehensive error handling
- Generates complete build summaries with deployment information

**When to Use**:

- Complete end-to-end build workflow from source to deployment artifacts
- Starting a developer build from scratch with fresh compilation
- Automated CI/CD build processes
- When you need both build and release packaging in one command

**Documentation**: [build-and-copy-to-release.md](./build-and-copy-to-release.md)

### build-tauri.ts

**Purpose**: Builds the Tauri application including frontend and backend compilation

**Key Functions**:

- Pre-flight checks (tools, environment, project structure validation)
- Dependencies preparation (pnpm install, database generation)
- Tauri application build (includes frontend build automatically)
- Build artifact validation and verification
- Build summary and next steps guidance

**When to Use**:

- Building the application for development or testing
- Creating fresh build artifacts without release packaging
- When you only need the build without release bundle creation
- As part of automated CI/CD build processes

**Documentation**: [build-tauri.md](./build-tauri.md)

### copy-build-files-to-release.ts

**Purpose**: Copies existing build artifacts to structured release directories

**Key Functions**:

- Validates existing build artifacts from Tauri build output
- Creates version-specific release directory structure
- Copies and organizes files for distribution and developer testing
- Generates update manifests (update.json) and master index (index.json)
- Updates build documentation and deployment guides for developers

**When to Use**:

- When you have existing build artifacts and need to package them for testing
- Iterating on build configurations without rebuilding
- Testing different domains or deployment settings
- As the second step after build-tauri.ts in a modular developer workflow

**Documentation**: [copy-to-release.md](./copy-to-release.md)

### generate-migrations.ts

**Purpose**: Generates Rust migration files from Drizzle SQL migrations

**Key Functions**:

- Scans SQL migration files created by `drizzle-kit generate`
- Extracts version numbers from migration filenames (e.g., 0001_create_table.sql)
- Generates Rust code compatible with `tauri-plugin-sql`
- Creates `load_migrations()` function for Tauri applications
- Automates database migration integration for developers

**When to Use**:

- After creating or updating database schema in Drizzle during development
- When you need to integrate SQL migrations into Tauri app development
- As part of database development workflow and schema changes
- For automated migration generation in development and CI/CD

**Documentation**: [generate-migrations.md](./generate-migrations.md)

### utils/shared.ts

**Purpose**: Common utilities and functions shared across all scripts

**Key Functions**:

- Type definitions and interfaces for all scripts
- File operations (copying, validation, sizing, permissions)
- Configuration management and environment handling
- Process execution and command management
- Error handling and logging utilities
- Template processing and content generation

**When to Use**:

- Automatically used by all other scripts
- When extending scripts with new functionality
- For maintaining consistency across the script ecosystem

**Documentation**: [shared-utils.md](./shared-utils.md)

## 📋 Quick Command Reference

### Complete Release Workflow

```bash
# Full end-to-end build and release
pnpm release

# Release with custom version (overrides tauri.conf.json)
pnpm release -- -v 1.0.0

# Release with custom domain for testing
pnpm release -- -d https://dev.mydomain.com

# Force overwrite existing build artifacts
pnpm release:force

# Skip build step (only copy existing artifacts)
pnpm release:skip-build

# Skip copy step (only build)
pnpm release:skip-copy

# Show help
pnpm release:help
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

# Copy with custom domain for development testing
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

### Advanced Workflow Combinations

```bash
# Development iteration workflow
pnpm build:tauri:skip-deps    # Fast build for development
pnpm copy:build-files:force   # Overwrite for testing

# Multi-target builds for development testing
pnpm release -- -t x86_64-apple-darwin
pnpm release -- -t aarch64-apple-darwin --skip-deps

# CI/CD friendly commands (version from tauri.conf.json if not specified)
pnpm release -- -v $VERSION -d $DEV_DOMAIN --skip-deps
```

## 🔧 Code Sharing Architecture

### Shared Utilities Module

The `utils/shared.ts` module eliminates code duplication by providing common functionality used by all scripts:

**Build Functions** (used by `build-tauri.ts`):

- `validateProjectStructure()` - Project structure validation
- `checkRequiredTools()` - Tool availability checks
- `checkEnvironment()` - Environment validation
- `loadEnvironmentVariables()` - Environment setup
- `executeCommand()` - Process execution with error handling
- `getVersion()` - Version detection from configuration

**Copy Functions** (used by `copy-build-files-to-release.ts`):

- `checkBuildArtifacts()` - Build artifact validation
- `createBundleStructure()` - Release directory creation
- `copyArtifacts()` - File copying with permission preservation
- `createUpdateManifest()` - Tauri updater manifest generation
- `updateIndex()` - Master index management
- `validateBundle()` - Release bundle integrity checking

**Orchestration Functions** (used by `build-and-copy-to-release.ts`):

- All of the above functions through script imports
- Configuration management and state coordination
- Cross-script error handling and reporting
- Workflow progress monitoring and logging

**Migration Functions** (used by `generate-migrations.ts`):

- File system operations for migration scanning
- Version extraction and sorting utilities
- Rust code generation and template processing
- Error handling for migration workflows

**Type Definitions**:

- `Config` - Global configuration interface
- `BuildArtifacts` - Build artifact paths and metadata
- `UpdateManifest` - Tauri updater format specification
- `BundleIndex` - Master release index structure
- `RequiredTool` - Tool validation interface
- `BuildOptions`, `CopyOptions`, `ReleaseOptions` - Script-specific options

**Utility Functions**:

- File operations (copy, validation, sizing, permissions)
- Format conversion (bytes, URLs, template processing)
- Process management (commands, errors, interrupts, logging)
- Environment handling (variables, paths, configuration)

### Benefits of Shared Code

1. **Consistency**: Same logic and behavior across all scripts
2. **Maintainability**: Single source of truth for common operations
3. **Type Safety**: Shared TypeScript interfaces and comprehensive type definitions
4. **Error Handling**: Standardized error messages, recovery patterns, and user guidance
5. **Testing**: Centralized test coverage for shared functionality
6. **Modularity**: Each script focuses on its specific responsibility
7. **Reusability**: Functions can be used by future scripts and tools
8. **Documentation**: Centralized documentation for common patterns

## 📖 Documentation Guide

### For Users

1. **Quick Start**: [quick-reference.md](./quick-reference.md) for immediate command usage
2. **Complete Workflow**: [build-and-copy-to-release.md](./build-and-copy-to-release.md) for full releases
3. **Individual Operations**: Script-specific documentation for targeted tasks

### For Developers

1. **Architecture**: [shared-utils.md](./shared-utils.md) for understanding the foundation
2. **Script Internals**: Individual script documentation for detailed implementation
3. **Extension Patterns**: Shared utilities documentation for adding new functionality
4. **Template System**: [template-system.md](./template-system.md) for content generation

### For DevOps/CI

1. **Automation**: Script documentation for CI/CD integration patterns
2. **Configuration**: Environment setup and deployment configuration
3. **Monitoring**: Error handling and logging for automated systems

## 🎯 Key Features

### TypeScript-Based

- Full type safety across all scripts
- Modern ES modules with comprehensive imports/exports
- IDE support with IntelliSense and error detection
- Comprehensive error handling with typed exceptions

### Modular Design

- Clear separation of concerns across scripts
- Shared utilities for common operations
- Reusable functions and consistent interfaces
- Easy to extend, maintain, and test individually

### Template-Based Configuration

- External template files for maintainable content generation
- Dynamic value replacement system with validation
- Clean separation of structure and data
- Easy customization without code changes

### Professional Workflow

- Pre-flight validation and environment checking
- Progress reporting and user feedback
- Error recovery and graceful degradation
- Comprehensive logging and audit trails

### Production Ready

- Robust error handling with user-friendly messages
- Graceful process interruption and cleanup
- Validation at every step with detailed reporting
- Security best practices and signing integration

## 🔍 Finding Information

### By Task

- **Complete release**: [build-and-copy-to-release.md](./build-and-copy-to-release.md)
- **Build only**: [build-tauri.md](./build-tauri.md)
- **Copy/package only**: [copy-to-release.md](./copy-to-release.md)
- **Database migrations**: [generate-migrations.md](./generate-migrations.md)
- **Quick commands**: [quick-reference.md](./quick-reference.md)

### By Component

- **Scripts**: Individual script documentation files
- **Utilities**: [shared-utils.md](./shared-utils.md)
- **Templates**: [template-system.md](./template-system.md)
- **Configuration**: Script-specific configuration sections

### By Role

- **End Users**: Quick reference and workflow guides
- **Developers**: Script documentation and architecture guides
- **DevOps**: Automation sections and configuration guides
- **Maintainers**: All documentation for comprehensive understanding

## 📈 Recent Updates

The scripts reflect the latest improvements to the Container Kit development system:

1. **Modular Architecture**: Split monolithic release script into focused components
2. **TypeScript Migration**: Complete rewrite from JavaScript/Shell to TypeScript
3. **Code Sharing**: Extraction of common utilities to reduce duplication
4. **Template System**: External template files with dynamic value replacement
5. **Workflow Optimization**: Improved build processes and artifact handling
6. **Enhanced Documentation**: Comprehensive guides for all aspects and use cases
7. **Better Error Handling**: Standardized error messages and recovery procedures
8. **Orchestration Support**: Unified workflow management with flexible execution

## 🆘 Support

For issues with the scripts or documentation:

1. **Check the relevant documentation** for your specific task and requirements
2. **Review error messages** - they include helpful solutions and next steps
3. **Verify prerequisites** as outlined in the script-specific documentation
4. **Check troubleshooting sections** in individual script documentation
5. **Use debug mode** (`DEBUG=1`) for detailed logging and diagnostics

## 🤝 Contributing

When updating or extending the scripts:

1. **Update documentation** alongside any code changes
2. **Follow TypeScript patterns** established in shared utilities
3. **Add comprehensive error handling** with helpful user messages
4. **Update this index** if adding new documentation files or scripts
5. **Test thoroughly** with various scenarios, edge cases, and configurations
6. **Maintain compatibility** with existing workflows and automation

## 📝 Template System

The scripts use a sophisticated template system for generating documentation and configuration files:

- **Template Files**: Located in `templates/` directory
- **Dynamic Replacement**: Variables replaced at runtime based on build/release context
- **Maintainable Content**: Templates can be updated without touching script code
- **Consistent Formatting**: Standardized output across all generated files

See [template-system.md](./template-system.md) for detailed information.

---

This documentation provides a complete guide to the Container Kit script ecosystem. Each linked document contains detailed information for its specific area of responsibility, from quick command references to comprehensive implementation guides.
