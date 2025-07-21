import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './src-tauri/migrations/',
    schema: './src/lib/db/schema.ts',
    dialect: 'sqlite',
    verbose: true,
    strict: true
});
