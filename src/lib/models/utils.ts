import type { InferInsertModel } from 'drizzle-orm';
import { seeds } from '$lib/db/schema';

export type ErrorLog = {
    stderr: string;
    stdout: string;
};

export type Seeds = 'registery_seed_v1' | 'network_v1';

export type InsertSeed = InferInsertModel<typeof seeds>;