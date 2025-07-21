/**
 * Shared utilities for Container Kit release scripts
 * Contains common functions, types, and configurations used by both
 * copy-build-files-to-release.ts and release.ts scripts
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface Config {
    domain: string;
    projectRoot: string;
    tauriConf: string;
    bundleDir: string;
    packageJson: string;
}

export interface BuildArtifacts {
    dmg: string;
    appBundle: string;
    signature: string;
    appDir: string;
}

export interface UpdateManifest {
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

export interface BundleIndex {
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

export interface VersionInfo {
    release_date: string;
    manifest_url: string;
    downloads: {
        dmg: string;
        app_bundle: string;
        app_directory: string;
    };
    platforms: string[];
    file_size: number;
    changelog: string[];
}

export interface RequiredTool {
    command: string;
    name: string;
}

// ============================================================================
// Constants and Configuration
// ============================================================================

export const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    reset: '\x1b[0m'
} as const;

export const getConfig = (): Config => ({
    domain: 'https://container-kit.ethercorps.io/release',
    projectRoot: path.resolve(__dirname, '../..'),
    get tauriConf() {
        return path.join(this.projectRoot, 'src-tauri', 'tauri.conf.json');
    },
    get bundleDir() {
        return path.join(this.projectRoot, 'release');
    },
    get packageJson() {
        return path.join(this.projectRoot, 'package.json');
    }
});

// ============================================================================
// Utility Functions
// ============================================================================

export const log = {
    info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
    success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    step: (msg: string) => console.log(`${colors.cyan}🔄 ${msg}${colors.reset}`),
    header: (msg: string) => {
        console.log('');
        console.log(`${colors.magenta}${'='.repeat(60)}${colors.reset}`);
        console.log(`${colors.magenta}🚀 ${msg}${colors.reset}`);
        console.log(`${colors.magenta}${'='.repeat(60)}${colors.reset}`);
        console.log('');
    }
};

/**
 * Get version from tauri.conf.json or use override
 */
export function getVersion(overrideVersion?: string): string {
    if (overrideVersion) {
        return overrideVersion;
    }

    const config = getConfig();
    if (!fs.existsSync(config.tauriConf)) {
        log.error(`tauri.conf.json not found at ${config.tauriConf}`);
        process.exit(1);
    }

    try {
        const tauriConfig = JSON.parse(fs.readFileSync(config.tauriConf, 'utf8'));
        const version = tauriConfig.version;

        if (!version) {
            log.error('Could not extract version from tauri.conf.json');
            process.exit(1);
        }

        return version;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Error reading tauri.conf.json: ${errorMessage}`);
        process.exit(1);
    }
}

/**
 * Get current timestamp in ISO format
 */
export function getTimestamp(): string {
    return new Date().toISOString();
}

/**
 * URL encode spaces and special characters
 */
export function urlEncode(str: string): string {
    return str.replace(/ /g, '%20');
}

/**
 * Get file size in bytes
 */
export function getFileSize(filePath: string): number {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    } catch (error) {
        return 0;
    }
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Copy file with error handling
 */
export function copyFileSync(src: string, dest: string): void {
    try {
        fs.copyFileSync(src, dest);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Failed to copy file ${src} to ${dest}: ${errorMessage}`);
        process.exit(1);
    }
}

/**
 * Recursively copy directory
 */
export function copyDirSync(src: string, dest: string): void {
    try {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const files = fs.readdirSync(src);

        for (const file of files) {
            const srcPath = path.join(src, file);
            const destPath = path.join(dest, file);

            if (fs.statSync(srcPath).isDirectory()) {
                copyDirSync(srcPath, destPath);
            } else {
                copyFileSync(srcPath, destPath);
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Failed to copy directory ${src} to ${dest}: ${errorMessage}`);
        process.exit(1);
    }
}

/**
 * Execute command with error handling
 */
export function executeCommand(
    command: string,
    description: string,
    cwd: string = getConfig().projectRoot
): void {
    log.step(description);
    try {
        execSync(command, {
            cwd,
            stdio: 'inherit',
            env: { ...process.env }
        });
        log.success(`${description} completed`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`${description} failed: ${errorMessage}`);
        process.exit(1);
    }
}

/**
 * Check if build artifacts exist for given version
 */
export function checkBuildArtifacts(version: string): BuildArtifacts {
    const config = getConfig();
    const targetDir = path.join(
        config.projectRoot,
        'src-tauri',
        'target',
        'aarch64-apple-darwin',
        'release',
        'bundle'
    );

    const artifacts: BuildArtifacts = {
        dmg: path.join(targetDir, 'dmg', `Container Kit_${version}_aarch64.dmg`),
        appBundle: path.join(targetDir, 'macos', 'Container Kit.app.tar.gz'),
        signature: path.join(targetDir, 'macos', 'Container Kit.app.tar.gz.sig'),
        appDir: path.join(targetDir, 'macos', 'Container Kit.app')
    };

    const artifactTypes: Array<{ type: keyof BuildArtifacts; name: string }> = [
        { type: 'dmg', name: 'DMG file' },
        { type: 'appBundle', name: 'App bundle' },
        { type: 'signature', name: 'Signature file' },
        { type: 'appDir', name: 'App directory' }
    ];

    for (const { type, name } of artifactTypes) {
        if (!fs.existsSync(artifacts[type])) {
            log.error(`${name} not found: ${artifacts[type]}`);
            log.info('Please run "tauri build" first');
            process.exit(1);
        }
    }

    log.success('All build artifacts found');
    return artifacts;
}

/**
 * Create bundle directory structure
 */
export function createBundleStructure(
    version: string,
    force: boolean
): { versionDir: string; macosDir: string } {
    const config = getConfig();
    const versionDir = path.join(config.bundleDir, version);
    const macosDir = path.join(versionDir, 'macos');

    if (fs.existsSync(versionDir) && !force) {
        log.error(`Bundle for version ${version} already exists`);
        log.info('Use -f/--force to overwrite, or increment the version');
        process.exit(1);
    }

    log.info(`Creating bundle directory structure for version ${version}`);

    try {
        fs.mkdirSync(macosDir, { recursive: true });
        log.success(`Created bundle directory: ${versionDir}`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Failed to create directory structure: ${errorMessage}`);
        process.exit(1);
    }

    return { versionDir, macosDir };
}

/**
 * Copy build artifacts to release directory
 */
export function copyArtifacts(version: string, artifacts: BuildArtifacts, macosDir: string): void {
    log.info('Copying build artifacts...');

    // Copy DMG
    copyFileSync(artifacts.dmg, path.join(macosDir, path.basename(artifacts.dmg)));
    log.success('Copied DMG file');

    // Copy app bundle and signature
    copyFileSync(artifacts.appBundle, path.join(macosDir, 'Container Kit.app.tar.gz'));
    copyFileSync(artifacts.signature, path.join(macosDir, 'Container Kit.app.tar.gz.sig'));
    log.success('Copied app bundle and signature');

    // Copy app directory
    copyDirSync(artifacts.appDir, path.join(macosDir, 'Container Kit.app'));
    log.success('Copied app directory');
}

/**
 * Create update.json manifest for Tauri updater
 */
export function createUpdateManifest(version: string, versionDir: string, domain: string): void {
    log.info('Creating update manifest...');

    const sigFile = path.join(versionDir, 'macos', 'Container Kit.app.tar.gz.sig');
    const signature = fs.readFileSync(sigFile, 'utf8').trim();
    const timestamp = getTimestamp();

    const manifest: UpdateManifest = {
        version: version,
        notes: `Container Kit v${version}\\n\\n🚀 What's New:\\n- Latest features and improvements\\n- Enhanced performance and stability\\n- Bug fixes and optimizations\\n\\n📦 Downloads:\\n- DMG installer for new installations\\n- Automatic updates for existing users\\n\\nFor detailed changelog, visit our releases page.`,
        pub_date: timestamp,
        platforms: {
            'darwin-aarch64': {
                signature: signature,
                url: `${domain}/${version}/macos/${urlEncode('Container Kit.app.tar.gz')}`
            }
        }
    };

    try {
        fs.writeFileSync(path.join(versionDir, 'update.json'), JSON.stringify(manifest, null, 4));
        log.success('Created update manifest');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Failed to create update manifest: ${errorMessage}`);
        process.exit(1);
    }
}

/**
 * Update or create master index.json
 */
export function updateIndex(version: string, domain: string): void {
    log.info('Updating bundle index...');

    const config = getConfig();
    const timestamp = getTimestamp();
    const appBundleSize = getFileSize(
        path.join(config.bundleDir, version, 'macos', 'Container Kit.app.tar.gz')
    );

    // Get public key from tauri.conf.json
    const tauriConfig = JSON.parse(fs.readFileSync(config.tauriConf, 'utf8'));
    const pubkey = tauriConfig.plugins?.updater?.pubkey || '';

    const indexPath = path.join(config.bundleDir, 'index.json');

    if (fs.existsSync(indexPath)) {
        log.info('Updating existing index.json');
        // Create backup
        fs.copyFileSync(indexPath, path.join(config.bundleDir, 'index.json.bak'));
        log.warning('Recreating index.json - consider using proper JSON merging for production');
    }

    const index: BundleIndex = {
        name: 'Container Kit',
        description: 'GUI for apple container CLI',
        latest_version: version,
        versions: {
            [version]: {
                release_date: timestamp,
                manifest_url: `./${version}/update.json`,
                downloads: {
                    dmg: `./${version}/macos/${urlEncode(`Container Kit_${version}_aarch64.dmg`)}`,
                    app_bundle: `./${version}/macos/${urlEncode('Container Kit.app.tar.gz')}`,
                    app_directory: `./${version}/macos/${urlEncode('Container Kit.app')}`
                },
                platforms: ['darwin-aarch64'],
                file_size: appBundleSize,
                changelog: [
                    'Latest features and improvements',
                    'Enhanced performance and stability',
                    'Bug fixes and optimizations',
                    'Improved user experience',
                    'Updated dependencies and security patches'
                ]
            }
        },
        updater: {
            endpoint: `${domain}/{version}/update.json`,
            public_key: pubkey
        },
        metadata: {
            created: timestamp,
            last_updated: timestamp,
            bundle_format_version: '1.0'
        }
    };

    try {
        fs.writeFileSync(indexPath, JSON.stringify(index, null, 4));
        log.success('Updated bundle index');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Failed to update index: ${errorMessage}`);
        process.exit(1);
    }
}

/**
 * Validate bundle integrity
 */
export function validateBundle(version: string): void {
    log.info('Validating bundle...');

    const config = getConfig();
    const versionDir = path.join(config.bundleDir, version);
    const requiredFiles = [
        path.join(versionDir, 'update.json'),
        path.join(versionDir, 'macos', 'Container Kit.app.tar.gz'),
        path.join(versionDir, 'macos', 'Container Kit.app.tar.gz.sig'),
        path.join(versionDir, 'macos', `Container Kit_${version}_aarch64.dmg`),
        path.join(versionDir, 'macos', 'Container Kit.app'),
        path.join(config.bundleDir, 'index.json'),
        path.join(config.bundleDir, 'README.md')
    ];

    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            log.error(`Missing required file: ${file}`);
            process.exit(1);
        }
    }

    // Validate JSON files
    try {
        JSON.parse(fs.readFileSync(path.join(versionDir, 'update.json'), 'utf8'));
        JSON.parse(fs.readFileSync(path.join(config.bundleDir, 'index.json'), 'utf8'));
        log.success('JSON files are valid');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Invalid JSON: ${errorMessage}`);
        process.exit(1);
    }

    log.success('Bundle validation completed');
}

/**
 * Check if project is in correct directory
 */
export function validateProjectStructure(): void {
    const config = getConfig();

    if (!fs.existsSync(config.tauriConf)) {
        log.error('Not in a Tauri project directory');
        log.info('Please run this script from the project root');
        process.exit(1);
    }

    if (!fs.existsSync(config.packageJson)) {
        log.error('package.json not found');
        process.exit(1);
    }
}

/**
 * Check required tools availability
 */
export function checkRequiredTools(): void {
    const requiredTools: RequiredTool[] = [
        { command: 'node --version', name: 'Node.js' },
        { command: 'pnpm --version', name: 'pnpm' },
        { command: 'tauri --version', name: 'Tauri CLI' }
    ];

    for (const tool of requiredTools) {
        try {
            execSync(tool.command, { stdio: 'pipe' });
            log.success(`${tool.name} is available`);
        } catch (error) {
            log.error(`${tool.name} is not available or not in PATH`);
            process.exit(1);
        }
    }
}

/**
 * Check environment configuration
 */
export function checkEnvironment(): void {
    const config = getConfig();
    const envFile = path.join(config.projectRoot, '.env');

    if (!fs.existsSync(envFile)) {
        log.warning('.env file not found - make sure signing keys are configured');
    } else {
        log.success('.env file found');
    }
}

/**
 * Load environment variables from .env file
 */
export function loadEnvironmentVariables(): void {
    const config = getConfig();
    const envFile = path.join(config.projectRoot, '.env');

    if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf8');
        const envVars: Record<string, string> = {};

        envContent.split('\n').forEach((line) => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                envVars[key.trim()] = valueParts.join('=').trim();
            }
        });

        // Set environment variables
        Object.assign(process.env, envVars);
    }
}

/**
 * Show summary of created release
 */
export function showBundleSummary(version: string, domain: string): void {
    const config = getConfig();
    const appBundleSize = getFileSize(
        path.join(config.bundleDir, version, 'macos', 'Container Kit.app.tar.gz')
    );
    const dmgSize = getFileSize(
        path.join(config.bundleDir, version, 'macos', `Container Kit_${version}_aarch64.dmg`)
    );

    console.log('');
    console.log('======================================================');
    console.log(`${colors.green}✅ Bundle Creation Complete!${colors.reset}`);
    console.log('======================================================');
    console.log('');
    console.log(`📦 Version: ${version}`);
    console.log(`📁 Bundle Directory: ${path.join(config.bundleDir, version)}`);
    console.log(`🌐 Domain: ${domain}`);
    console.log(`📊 App Bundle Size: ${formatBytes(appBundleSize)}`);
    console.log(`📊 DMG Size: ${formatBytes(dmgSize)}`);
    console.log('');
    console.log('📋 Next Steps:');
    console.log(`1. Review the generated files in ${config.bundleDir}`);
    console.log('2. Update the domain URLs in the JSON files if needed');
    console.log('3. Upload the release directory to your web server');
    console.log('4. Test the updater functionality');
    console.log('');
    console.log('🔗 Key URLs:');
    console.log(`   Update Manifest: ${domain}/${version}/update.json`);
    console.log(
        `   DMG Download: ${domain}/${version}/macos/${urlEncode(`Container Kit_${version}_aarch64.dmg`)}`
    );
    console.log('');
}

/**
 * Handle process interruption gracefully
 */
export function setupInterruptHandlers(): void {
    process.on('SIGINT', () => {
        log.warning('\nOperation interrupted by user');
        process.exit(0);
    });

    process.on('uncaughtException', (error: Error) => {
        log.error(`Uncaught Exception: ${error.message}`);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
        log.error(`Unhandled Rejection: ${reason}`);
        process.exit(1);
    });
}

/**
 * Check if current module is the main module (for ES modules)
 */
export function isMainModule(importMetaUrl: string): boolean {
    return importMetaUrl === `file://${process.argv[1]}`;
}

/**
 * Process template file with dynamic value replacement
 */
export function processTemplate(
    templatePath: string,
    replacements: Record<string, string>
): string {
    try {
        let content = fs.readFileSync(templatePath, 'utf8');

        // Replace all placeholders with actual values
        for (const [key, value] of Object.entries(replacements)) {
            const placeholder = `{{${key}}}`;
            content = content.replace(new RegExp(placeholder, 'g'), value);
        }

        return content;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        log.error(`Failed to process template ${templatePath}: ${errorMessage}`);
        process.exit(1);
    }
}
