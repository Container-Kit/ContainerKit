#!/usr/bin/env tsx

/**
 * Container Kit Tauri Build Script
 * This script handles the complete Tauri application build process including dependencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    getConfig,
    getVersion,
    log,
    executeCommand,
    validateProjectStructure,
    checkRequiredTools,
    checkEnvironment,
    loadEnvironmentVariables,
    setupInterruptHandlers,
    isMainModule,
    type Config
} from './utils/shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Build-specific Types
// ============================================================================

interface BuildOptions {
    version?: string;
    skipDependencies: boolean;
    target: string;
}

// ============================================================================
// Configuration
// ============================================================================

const config: Config = getConfig();

// ============================================================================
// CLI Functions
// ============================================================================

function showUsage(): void {
    console.log('Usage: tsx build-tauri.ts [OPTIONS]');
    console.log('');
    console.log('This script performs a complete Tauri build process:');
    console.log('1. Pre-flight checks');
    console.log('2. Prepare dependencies (pnpm install, db:generate)');
    console.log('3. Build Tauri app (includes frontend build automatically)');
    console.log('4. Verify build artifacts');
    console.log('');
    console.log('Options:');
    console.log('  -v, --version VERSION      Override version (default: read from tauri.conf.json)');
    console.log('  -t, --target TARGET        Build target (default: aarch64-apple-darwin)');
    console.log('  --skip-deps                Skip dependency preparation');
    console.log('  -h, --help                 Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  tsx build-tauri.ts                    # Full build workflow');
    console.log('  tsx build-tauri.ts -v 0.3.0          # Override version');
    console.log('  tsx build-tauri.ts --skip-deps       # Skip dependency preparation');
    console.log('  tsx build-tauri.ts -t universal-apple-darwin  # Build for universal target');
}

function parseArgs(): BuildOptions {
    const args = process.argv.slice(2);
    const options: BuildOptions = {
        version: undefined,
        skipDependencies: false,
        target: 'aarch64-apple-darwin'
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-v':
            case '--version':
                options.version = args[++i];
                break;
            case '-t':
            case '--target':
                options.target = args[++i];
                break;
            case '--skip-deps':
                options.skipDependencies = true;
                break;
            case '-h':
            case '--help':
                showUsage();
                process.exit(0);
                break;
            default:
                log.error(`Unknown option: ${args[i]}`);
                showUsage();
                process.exit(1);
        }
    }

    return options;
}

// ============================================================================
// Build Workflow Functions
// ============================================================================

function preflightChecks(): void {
    log.header('Pre-flight Checks');

    // Check project structure
    validateProjectStructure();

    // Check required tools
    checkRequiredTools();

    // Check environment
    checkEnvironment();

    log.success('Pre-flight checks completed');
}

function prepareDependencies(): void {
    log.header('Preparing Dependencies');

    // Install dependencies
    executeCommand('pnpm install', 'Installing dependencies');

    // Generate database artifacts
    executeCommand('pnpm db:generate', 'Generating database artifacts');

    log.success('Dependencies preparation completed successfully');
}

function buildTauri(target: string): void {
    log.header('Building Tauri Application');

    // Load environment variables
    loadEnvironmentVariables();

    // Build Tauri app (includes frontend build automatically)
    const buildCommand = `tauri build --target ${target}`;
    executeCommand(
        buildCommand,
        `Building Tauri application for ${target} (includes frontend)`
    );

    // Verify build artifacts
    const targetDir = path.join(
        config.projectRoot,
        'src-tauri',
        'target',
        target,
        'release',
        'bundle'
    );

    if (!fs.existsSync(targetDir)) {
        log.error('Tauri build failed - target directory not found');
        process.exit(1);
    }

    const dmgDir = path.join(targetDir, 'dmg');
    const macosDir = path.join(targetDir, 'macos');

    if (!fs.existsSync(dmgDir) || !fs.existsSync(macosDir)) {
        log.error('Tauri build failed - bundle artifacts not found');
        process.exit(1);
    }

    log.success('Tauri build completed successfully');
}

function validateBuildArtifacts(version: string, target: string): void {
    log.header('Validating Build Artifacts');

    const targetDir = path.join(
        config.projectRoot,
        'src-tauri',
        'target',
        target,
        'release',
        'bundle'
    );

    const expectedArtifacts = [
        path.join(targetDir, 'dmg', `Container Kit_${version}_${target}.dmg`),
        path.join(targetDir, 'macos', 'Container Kit.app.tar.gz'),
        path.join(targetDir, 'macos', 'Container Kit.app.tar.gz.sig'),
        path.join(targetDir, 'macos', 'Container Kit.app')
    ];

    let allArtifactsExist = true;
    for (const artifact of expectedArtifacts) {
        if (fs.existsSync(artifact)) {
            log.success(`Found: ${path.relative(config.projectRoot, artifact)}`);
        } else {
            log.error(`Missing: ${path.relative(config.projectRoot, artifact)}`);
            allArtifactsExist = false;
        }
    }

    if (!allArtifactsExist) {
        log.error('Build validation failed - missing artifacts');
        process.exit(1);
    }

    log.success('Build artifacts validation completed successfully');
}

function showBuildSummary(version: string, target: string, options: BuildOptions): void {
    const targetDir = path.join(
        config.projectRoot,
        'src-tauri',
        'target',
        target,
        'release',
        'bundle'
    );

    log.header('Build Summary');

    console.log(`🏗️  Build Information:`);
    console.log(`   Version: ${version}`);
    console.log(`   Target: ${target}`);
    console.log(`   Build Directory: ${path.relative(config.projectRoot, targetDir)}`);
    console.log('');

    console.log(`🛠️  Build Steps Executed:`);
    console.log('   ✅ Pre-flight checks');

    if (!options.skipDependencies) {
        console.log('   ✅ Dependencies preparation');
    } else {
        console.log('   ⏭️  Dependencies preparation (skipped)');
    }

    console.log('   ✅ Tauri build (includes frontend)');
    console.log('   ✅ Artifact validation');
    console.log('');

    console.log(`📋 Next Steps:`);
    console.log('1. Review the generated build artifacts');
    console.log('2. Test the application locally');
    console.log('3. Use copy-build-files-to-release.ts to create release bundles');
    console.log('4. Or use build-and-copy-to-release.ts for the complete workflow');
    console.log('');

    console.log(`🎉 Tauri build ${version} completed successfully!`);
    console.log('');
}

// ============================================================================
// Main Function
// ============================================================================

async function main(): Promise<void> {
    log.header('Container Kit Tauri Build Workflow');

    // Parse arguments
    const options = parseArgs();

    // Get version
    const version = getVersion(options.version);
    log.info(`Build version: ${version}`);
    log.info(`Build target: ${options.target}`);

    // Show what will be executed
    console.log(`📋 Planned Steps:`);
    console.log('   ✅ Pre-flight checks');

    if (!options.skipDependencies) {
        console.log('   📦 Dependencies preparation');
    } else {
        console.log('   ⏭️  Dependencies preparation (skipped)');
    }

    console.log('   🦀 Tauri build (includes frontend)');
    console.log('   ✅ Artifact validation');
    console.log('   📊 Summary');
    console.log('');

    // Confirm execution
    log.warning('This will perform a complete Tauri build. Continue? (Ctrl+C to abort)');

    // Wait a moment for user to read
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Execute workflow
    try {
        // 1. Pre-flight checks
        preflightChecks();

        // 2. Prepare dependencies (unless skipped)
        if (!options.skipDependencies) {
            prepareDependencies();
        } else {
            log.info('Skipping dependency preparation');
        }

        // 3. Build Tauri app
        buildTauri(options.target);

        // 4. Validate build artifacts
        validateBuildArtifacts(version, options.target);

        // 5. Show summary
        showBuildSummary(version, options.target, options);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Build workflow failed: ${errorMessage}`);
        process.exit(1);
    }
}

// ============================================================================
// Entry Point
// ============================================================================

// Setup interrupt handlers
setupInterruptHandlers();

// Run main function if this is the main module
if (isMainModule(import.meta.url)) {
    main();
}

// Export main function for use by other scripts
export { main, type BuildOptions };
