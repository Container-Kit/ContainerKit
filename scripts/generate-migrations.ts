#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface Migration {
    filename: string;
    version: number;
    description: string;
}

class MigrationGenerator {
    private readonly outDir: string = './src-tauri/migrations';
    private readonly migrationsDir: string = './src-tauri/migrations';
    private readonly outFile: string = path.join(this.outDir, 'generated_migrations.rs');

    /**
     * Ensure output directory exists
     */
    private ensureOutputDir(): void {
        if (!fs.existsSync(this.outDir)) {
            fs.mkdirSync(this.outDir, { recursive: true });
        }
    }

    /**
     * Extract version number from migration filename
     * @param filename - Migration filename like "0000_slow_scarecrow.sql"
     * @returns Version number
     */
    private extractVersion(filename: string): number {
        const stem = path.parse(filename).name;
        const versionStr = stem.split('_')[0];
        const version = parseInt(versionStr, 10);
        return isNaN(version) ? 0 : version;
    }

    /**
     * Read and process all SQL migration files
     * @returns Array of migration objects
     */
    private readMigrations(): Migration[] {
        if (!fs.existsSync(this.migrationsDir)) {
            console.error(`❌ Migrations directory not found: ${this.migrationsDir}`);
            return [];
        }

        const migrations: Migration[] = [];
        const entries = fs.readdirSync(this.migrationsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isFile() || !entry.name.endsWith('.sql')) {
                continue;
            }

            const filename = entry.name;
            const version = this.extractVersion(filename);
            const description = filename; // Always use "init" as per original Rust code

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
     * @param migrations - Array of migration objects
     * @returns Rust file content
     */
    private generateRustContent(migrations: Migration[]): string {
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
    public generate(): void {
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
            console.error('❌ Error during generation:', (error as Error).message);
            process.exit(1);
        }
    }
}

// Run the generator
const generator = new MigrationGenerator();
generator.generate();
