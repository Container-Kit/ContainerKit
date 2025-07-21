#!/usr/bin/env tsx

/**
 * Container Kit Copy Build Files Script
 * This script copies Tauri build artifacts to structured release directories
 */

import fs from 'fs';
import path from 'path';
import {
    getConfig,
    getVersion,
    getFileSize,
    formatBytes,
    log,
    checkBuildArtifacts,
    createBundleStructure,
    copyArtifacts,
    createUpdateManifest,
    updateIndex,
    validateBundle,
    validateProjectStructure,
    showBundleSummary,
    setupInterruptHandlers,
    isMainModule,
    processTemplate,
    type Config
} from './utils/shared.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Copy Options
// ============================================================================

type CopyOptions = {
    domain: string;
    version?: string;
    force: boolean;
};

// ============================================================================
// Configuration
// ============================================================================

const config: Config = getConfig();

// ============================================================================
// CLI Functions
// ============================================================================

function showUsage(): void {
    console.log('Usage: tsx copy-build-files-to-release.ts [OPTIONS]');
    console.log('');
    console.log('Options:');
    console.log(
        '  -d, --domain DOMAIN     Set the domain for update URLs (default: https://container-kit.ethercorps.io/release)'
    );
    console.log('  -v, --version VERSION   Override version (default: read from tauri.conf.json)');
    console.log('  -f, --force            Force overwrite existing bundle');
    console.log('  -h, --help             Show this help message');
    console.log('');
    console.log('Examples:');
    console.log(
        '  tsx copy-build-files-to-release.ts                                            # Use default settings'
    );
    console.log(
        '  tsx copy-build-files-to-release.ts -d https://container-kit.ethercorps.io     # Set custom domain'
    );
    console.log(
        '  tsx copy-build-files-to-release.ts -v 0.3.0 -f                                # Override version and force overwrite'
    );
}

function parseArgs(): CopyOptions {
    const args = process.argv.slice(2);
    const options: CopyOptions = {
        domain: config.domain,
        version: undefined,
        force: false
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '-d':
            case '--domain':
                options.domain = args[++i];
                break;
            case '-v':
            case '--version':
                options.version = args[++i];
                break;
            case '-f':
            case '--force':
                options.force = true;
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

function updateReadme(version: string, domain: string): void {
    log.info('Updating README...');

    const appBundleSize = getFileSize(
        path.join(config.bundleDir, version, 'macos', 'Container Kit.app.tar.gz')
    );
    const dmgSize = getFileSize(
        path.join(config.bundleDir, version, 'macos', `Container Kit_${version}_aarch64.dmg`)
    );

    const templatePath = path.join(
        __dirname,
        'templates',
        'copy-build-files-to-release.template.md'
    );
    const replacements = {
        VERSION: version,
        DOMAIN: domain,
        RELEASE_DATE: new Date().toISOString().split('T')[0],
        DMG_SIZE: formatBytes(dmgSize),
        APP_BUNDLE_SIZE: formatBytes(appBundleSize),
        TOTAL_SIZE: formatBytes(dmgSize + appBundleSize)
    };

    const readmeContent = processTemplate(templatePath, replacements);

    try {
        fs.writeFileSync(path.join(config.bundleDir, 'README.md'), readmeContent);
        log.success('Updated README');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Failed to update README: ${errorMessage}`);
        process.exit(1);
    }
}

// ============================================================================
// Main Function
// ============================================================================

async function main(): Promise<void> {
    console.log('');
    console.log('📁 Container Kit Copy Build Files Script');
    console.log('========================================');
    console.log('');

    // Parse arguments
    const options = parseArgs();

    // Validate project structure
    validateProjectStructure();

    // Get version
    const version = getVersion(options.version);
    log.info(`Detected version: ${version}`);

    // Check build artifacts
    const artifacts = checkBuildArtifacts(version);

    // Create bundle structure
    const { versionDir, macosDir } = createBundleStructure(version, options.force);

    // Copy artifacts
    copyArtifacts(version, artifacts, macosDir);

    // Create manifests and documentation
    createUpdateManifest(version, versionDir, options.domain);
    updateIndex(version, options.domain);
    updateReadme(version, options.domain);

    // Validate bundle
    validateBundle(version);

    // Show summary
    showBundleSummary(version, options.domain);
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
