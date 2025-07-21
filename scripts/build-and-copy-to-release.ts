#!/usr/bin/env tsx

/**
 * Container Kit Complete Release Workflow Script
 * This script orchestrates the complete release process by calling build-tauri.ts and copy-build-files-to-release.ts
 */

import path from 'path';
import { fileURLToPath } from 'url';
import {
    getConfig,
    getVersion,
    log,
    setupInterruptHandlers,
    isMainModule,
    type Config
} from './utils/shared.js';

// Import the other scripts
import { main as buildTauriMain } from './build-tauri.js';
import { main as copyBuildFilesMain } from './copy-build-files-to-release.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Release-specific Types
// ============================================================================

interface ReleaseOptions {
    domain: string;
    version?: string;
    force: boolean;
    skipBuild: boolean;
    skipDependencies: boolean;
    skipCopy: boolean;
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
    console.log('Usage: tsx build-and-copy-to-release.ts [OPTIONS]');
    console.log('');
    console.log('This script performs a complete release workflow:');
    console.log('1. Build Tauri app (via build-tauri.ts)');
    console.log('2. Copy build files to release (via copy-build-files-to-release.ts)');
    console.log('3. Summary and next steps');
    console.log('');
    console.log('Options:');
    console.log('  -v, --version VERSION   Override version (default: read from tauri.conf.json)');
    console.log(
        '  -d, --domain DOMAIN     Set the domain for update URLs (default: https://container-kit.ethercorps.io/release)'
    );
    console.log('  -t, --target TARGET     Build target (default: aarch64-apple-darwin)');
    console.log('  -f, --force             Force overwrite existing release bundle');
    console.log('  --skip-build            Skip the Tauri build step');
    console.log('  --skip-deps             Skip dependency preparation');
    console.log('  --skip-copy             Skip copying files to release');
    console.log('  -h, --help              Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  tsx build-and-copy-to-release.ts                    # Complete workflow');
    console.log('  tsx build-and-copy-to-release.ts -v 0.3.0           # Override version');
    console.log('  tsx build-and-copy-to-release.ts -d https://my.domain.com # Custom domain');
    console.log('  tsx build-and-copy-to-release.ts --skip-build       # Only copy files');
    console.log('  tsx build-and-copy-to-release.ts --skip-deps        # Skip dependency prep');
}

function parseArgs(): ReleaseOptions {
    const args = process.argv.slice(2);
    const options: ReleaseOptions = {
        domain: config.domain,
        version: undefined,
        force: false,
        skipBuild: false,
        skipDependencies: false,
        skipCopy: false,
        target: 'aarch64-apple-darwin'
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-v':
            case '--version':
                options.version = args[++i];
                break;
            case '-d':
            case '--domain':
                options.domain = args[++i];
                break;
            case '-t':
            case '--target':
                options.target = args[++i];
                break;
            case '-f':
            case '--force':
                options.force = true;
                break;
            case '--skip-build':
                options.skipBuild = true;
                break;
            case '--skip-deps':
                options.skipDependencies = true;
                break;
            case '--skip-copy':
                options.skipCopy = true;
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
// Workflow Orchestration Functions
// ============================================================================

async function executeBuildTauri(
    version: string,
    target: string,
    skipDependencies: boolean
): Promise<void> {
    log.header('Executing Tauri Build (build-tauri.ts)');

    // Set up arguments for build-tauri.ts
    const originalArgs = process.argv;
    const buildArgs = ['node', 'build-tauri.ts'];

    if (version) {
        buildArgs.push('-v', version);
    }
    if (target !== 'aarch64-apple-darwin') {
        buildArgs.push('-t', target);
    }
    if (skipDependencies) {
        buildArgs.push('--skip-deps');
    }

    // Temporarily override process.argv
    process.argv = buildArgs;

    try {
        await buildTauriMain();
        log.success('Tauri build completed successfully');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Tauri build failed: ${errorMessage}`);
        throw error;
    } finally {
        // Restore original args
        process.argv = originalArgs;
    }
}

async function executeCopyBuildFiles(
    version: string,
    domain: string,
    force: boolean
): Promise<void> {
    log.header('Executing Copy Build Files (copy-build-files-to-release.ts)');

    // Set up arguments for copy-build-files-to-release.ts
    const originalArgs = process.argv;
    const copyArgs = ['node', 'copy-build-files-to-release.ts'];

    if (version) {
        copyArgs.push('-v', version);
    }
    if (domain !== config.domain) {
        copyArgs.push('-d', domain);
    }
    if (force) {
        copyArgs.push('-f');
    }

    // Temporarily override process.argv
    process.argv = copyArgs;

    try {
        await copyBuildFilesMain();
        log.success('Copy build files completed successfully');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Copy build files failed: ${errorMessage}`);
        throw error;
    } finally {
        // Restore original args
        process.argv = originalArgs;
    }
}

function showReleaseSummary(version: string, domain: string, options: ReleaseOptions): void {
    log.header('Complete Release Summary');

    console.log(`🚀 Release Information:`);
    console.log(`   Version: ${version}`);
    console.log(`   Target: ${options.target}`);
    console.log(`   Domain: ${domain}`);

    if (!options.skipCopy) {
        const versionDir = path.join(config.bundleDir, version);
        console.log(`   Release Directory: ${path.relative(config.projectRoot, versionDir)}`);
    }
    console.log('');

    console.log(`🛠️  Workflow Steps Executed:`);

    if (!options.skipBuild) {
        console.log('   ✅ Tauri build (via build-tauri.ts)');
        if (!options.skipDependencies) {
            console.log('     - Dependencies preparation');
        }
        console.log('     - Frontend and backend build');
        console.log('     - Artifact validation');
    } else {
        console.log('   ⏭️  Tauri build (skipped)');
    }

    if (!options.skipCopy) {
        console.log('   ✅ Release bundle creation (via copy-build-files-to-release.ts)');
        console.log('     - Artifact copying');
        console.log('     - Manifest generation');
        console.log('     - Documentation updates');
    } else {
        console.log('   ⏭️  Release bundle creation (skipped)');
    }
    console.log('');

    if (!options.skipCopy) {
        console.log(`🔗 Download URLs:`);
        console.log(`   Update Manifest: ${domain}/${version}/update.json`);
        console.log(
            `   DMG Download: ${domain}/${version}/macos/Container%20Kit_${version}_${options.target}.dmg`
        );
        console.log(`   App Bundle: ${domain}/${version}/macos/Container%20Kit.app.tar.gz`);
        console.log('');
    }

    console.log(`📋 Next Steps:`);
    if (!options.skipCopy) {
        console.log('1. Review the generated release files');
        console.log('2. Test the application locally');
        console.log('3. Upload the release directory to your web server');
        console.log('4. Update your website with download links');
        console.log('5. Test the updater functionality');
        console.log('6. Announce the release');
    } else {
        console.log('1. Run copy-build-files-to-release.ts to create release bundles');
        console.log('2. Or manually organize the build artifacts');
    }
    console.log('');

    console.log(`🎉 Release workflow ${version} completed successfully!`);
    console.log('');
}

// ============================================================================
// Main Function
// ============================================================================

async function main(): Promise<void> {
    log.header('Container Kit Complete Release Workflow');

    // Parse arguments
    const options = parseArgs();

    // Get version
    const version = getVersion(options.version);
    log.info(`Release version: ${version}`);
    log.info(`Build target: ${options.target}`);
    log.info(`Release domain: ${options.domain}`);

    // Show what will be executed
    console.log(`📋 Planned Workflow:`);

    if (!options.skipBuild) {
        console.log('   🏗️  Tauri build (build-tauri.ts)');
        if (!options.skipDependencies) {
            console.log('     - Dependencies preparation');
        }
        console.log('     - Frontend and backend compilation');
        console.log('     - Artifact validation');
    } else {
        console.log('   ⏭️  Tauri build (skipped)');
    }

    if (!options.skipCopy) {
        console.log('   📁 Copy build files (copy-build-files-to-release.ts)');
        console.log('     - Artifact organization');
        console.log('     - Manifest creation');
        console.log('     - Documentation generation');
    } else {
        console.log('   ⏭️  Copy build files (skipped)');
    }

    console.log('   📊 Summary and next steps');
    console.log('');

    // Confirm execution
    log.warning('This will execute the complete release workflow. Continue? (Ctrl+C to abort)');

    // Wait a moment for user to read
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Execute workflow
    try {
        // 1. Build Tauri app (unless skipped)
        if (!options.skipBuild) {
            await executeBuildTauri(version, options.target, options.skipDependencies);
        } else {
            log.info('Skipping Tauri build');
        }

        // 2. Copy build files to release (unless skipped)
        if (!options.skipCopy) {
            await executeCopyBuildFiles(version, options.domain, options.force);
        } else {
            log.info('Skipping copy build files to release');
        }

        // 3. Show complete summary
        showReleaseSummary(version, options.domain, options);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Release workflow failed: ${errorMessage}`);
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
export { main };
