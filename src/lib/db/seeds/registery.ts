import { type InferInsertModel } from 'drizzle-orm';
import { seeds, registry } from '$lib/db/schema';
import { db } from '$lib/db';
import type { InsertSeed, Seeds } from '$lib/models/utils';
import type { InsertRegistry } from '$lib/models/container';

const registries: InsertRegistry[] = [
    {
        name: 'Docker',
        url: 'docker.io'
    }
];

export async function addRegistriesSeedV1() {
    const seedName: Seeds = 'registery_seed_v1';

    const seed = await db.query.seeds.findFirst({
        where: (seeds, { eq }) => eq(seeds.name, seedName)
    });

    if (seed && seed.applied) {
        return;
    }

    const seedData: InsertSeed = {
        name: seedName,
        applied: true
    };
    await Promise.all([db.insert(registry).values(registries), db.insert(seeds).values(seedData)]);
}
