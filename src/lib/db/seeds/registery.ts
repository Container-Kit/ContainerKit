import { type InferInsertModel } from 'drizzle-orm';
import { seeds, registry } from '$lib/db/schema';
import type { Seeds } from '$lib/db/types';
import { db } from '$lib/db';

type InsertRegistery = InferInsertModel<typeof registry>;
type InsertSeed = InferInsertModel<typeof seeds>;

const registries: InsertRegistery[] = [
    {
        name: 'Docker',
        url: 'docker.io',
        default: true
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
    await db.transaction(async (tx) => {
        tx.insert(registry).values(registries);
        tx.insert(seeds).values(seedData);
    });
}
