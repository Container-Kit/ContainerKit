import { drizzle } from 'drizzle-orm/sqlite-proxy';
import * as schema from './schema';
import Database from '@tauri-apps/plugin-sql';

const selectRegex = /^\s*SELECT\b/i;

function isSelectQuery(sql: string): boolean {
    return selectRegex.test(sql);
}

export const db = drizzle<typeof schema>(
    async (sql: string, params: string[], method: string) => {
        const sqlite = await Database.load('sqlite:container-kit.db');
        let rows: any[] = [];
        let results: any = [];

        try {
            if (isSelectQuery(sql)) {
                rows = await sqlite.select(sql, params as string[]);
            } else {
                await sqlite.execute(sql, params as string[]);
                // For non-select queries, Drizzle often expects an empty array for successful execution
                // or specific affected rows count depending on your needs.
                // In many cases, just returning an empty array is sufficient for Drizzle to proceed.
                return { rows: [] };
            }

            // The tauri-plugin-sql returns an array of objects.
            // Drizzle's sqlite-proxy expects an array of arrays for select results
            // where each inner array represents a row, and the values are in the order
            // of the columns in the original SQL query.
            // This mapping is crucial.
            rows = rows.map((row: any) => Object.values(row));

            results = method === 'all' ? rows : rows[0];
        } catch (e: any) {
            console.error('SQL Error:', e);
            // Handle errors appropriately for your application
            return { rows: [] };
        } finally {
            await sqlite.close(); // Close the database connection
        }

        return { rows: results };
    },
    { schema: schema, logger: true }
);
