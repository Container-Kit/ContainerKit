import type { InferInsertModel } from 'drizzle-orm';
import { registry, seeds } from '$lib/db/schema';

export type RegistryLoginParams = {
    username: string;
    password: string;
    scheme?: 'http' | 'https' | 'auto';
    registry: string;
};

export type RegistryLogoutParams = {
    registry: string;
}

export type InsertRegistry = InferInsertModel<typeof registry>;
