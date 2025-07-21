#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Node.js version of the Rust migration generator
 * Reads SQL migration files and generates a Rust migrations file
 */
class MigrationGenerator {
    constructor() {
        this.outDir = './rust-migrations';
        this.inputDir = './';
        this.migrationsDir = './src-tauri/migrations';
        this.outFile = path.join(this.outDir, 'generated_migrations.rs');
    }

    /**
     * Ensure output directory exists
     */
    ensureOutputDir() {
        if (!fs.existsSync(this.outDir)) {
            fs.mkdirSync(this.outDir, { recursive: true });
        }
    }

    /**
     * Extract version number from migration filename
     * @param {string} filename - Migration filename like "0000_slow_scarecrow.sql"
     * @returns {number} Version number
     */
    extractVersion(filename) {
        const stem = path.parse(filename).name;
        const versionStr = stem.split('_')[0];
        const version = parseInt(versionStr, 10);
        return isNaN(version) ? 0 : version;
    }

    /**
     * Read and process all SQL migration files
     * @returns {Array} Array of migration objects
     */
    readMigrations() {
        if (!fs.existsSync(this.migrationsDir)) {
            console.error(`❌ Migrations directory not found: ${this.migrationsDir}`);
            return [];
        }

        const migrations = [];
        const entries = fs.readdirSync(this.migrationsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith('.sql')) {
                continue;
            }

            const filename = entry.name;
            const version = this.extractVersion(filename);
            const description = 'init'; // Always use "init" as per original Rust code

            migrations.push({
                filename,
                version,
                description
            });
        }

        // Sort migrations by version
        migrations.sort((a, b) => a.version - b.version);
        return migrations;
    }

    /**
     * Generate the Rust migrations file content
     * @param {Array} migrations - Array of migration objects
     * @returns {string} Rust file content
     */
    generateRustContent(migrations) {
        let contents = `use tauri_plugin_sql::{Migration, MigrationKind};

pub fn load_migrations() -> Vec<Migration> {
    vec![
`;

        for (const migration of migrations) {
            contents += `        Migration { version: ${migration.version}, description: "${migration.description}", sql: include_str!("${migration.filename}"), kind: MigrationKind::Up },\n`;
        }

        contents += `    ]
}
`;

        return contents;
    }

    /**
     * Main generation function
     */
    generate() {
        console.log('🔄 Starting migration generation...');

        try {
            // Ensure output directory exists
            this.ensureOutputDir();

            // Read all migration files
            const migrations = this.readMigrations();

            if (migrations.length === 0) {
                console.log('⚠️  No SQL migration files found');
                return;
            }

            console.log(`📖 Found ${migrations.length} migration(s):`);
            migrations.forEach((m) => {
                console.log(`   - ${m.filename} (version: ${m.version})`);
            });

            // Generate Rust content
            const rustContent = this.generateRustContent(migrations);

            // Write the generated file
            fs.writeFileSync(this.outFile, rustContent);

            console.log(`✅ Generated: ${this.outFile}`);
            console.log('\n🎉 Migration generation completed successfully!');
        } catch (error) {
            console.error('❌ Error during generation:', error.message);
            process.exit(1);
        }
    }
}

// Run the generator
const generator = new MigrationGenerator();
generator.generate();
