import { sqliteTable, integer, text,  } from 'drizzle-orm/sqlite-core';
import { v7 as uuid } from 'uuid';

export const registry = sqliteTable('registry', {
    id: text('id').primaryKey().$defaultFn(() => uuid()),
    name: text('name').notNull().notNull(),
    url: text('url').unique().notNull(),
    default: integer('default', {mode: 'boolean'}).default(false),
    loggedIn: integer('logged_in', {mode: 'boolean'}).default(false),
})

export const seeds = sqliteTable('seeds', {
    id: text('id').primaryKey().$defaultFn(() => uuid()),
    name: text('name').notNull().unique(),
    applied: integer('applied', {mode: 'boolean'}).default(false),
})