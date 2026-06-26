import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { transformSpec } from './transform-spec';

const SPEC_URL =
    process.env.HIKKA_OPENAPI_URL ?? 'https://api.hikka.io/openapi.json';
const OUT = join(import.meta.dirname, '..', 'openapi.json');

async function main() {
    const res = await fetch(SPEC_URL, {
        headers: { 'User-Agent': 'hikka-codegen' },
    });
    if (!res.ok) throw new Error(`Failed to fetch spec: ${res.status}`);

    const spec = (await res.json()) as {
        paths: Record<string, Record<string, unknown>>;
    };
    transformSpec(spec as Parameters<typeof transformSpec>[0]);

    await writeFile(OUT, `${JSON.stringify(spec, null, 2)}\n`);

    const count = Object.values(spec.paths).reduce(
        (n, methods) => n + Object.keys(methods).length,
        0,
    );
    console.log(`Wrote ${OUT} (${count} operations, ids normalized)`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
