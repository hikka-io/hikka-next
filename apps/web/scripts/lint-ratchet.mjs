// Locks tagged layering diagnostic counts to lint-baseline.json and proves every canary is still reported; `--update` rewrites the baseline.
import { spawnSync } from 'node:child_process';
import {
    cpSync,
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const BASELINE = new URL('../lint-baseline.json', import.meta.url);
const TAG = /^\[([A-Z]\d+)\]|\/(G\d+)-/;
const LOCAL_BIOME = join(ROOT, 'node_modules/.bin/biome');
const LEAVES = [
    'filters',
    'notifications',
    'auth',
    'search',
    'effects',
    'oauth',
];

// One violation per override scope, plugin and guard: [path under apps/web/src, source, tags].
const CANARIES = [
    [
        'routes/canary.tsx',
        "import { xOptions } from '@/features/x';\nimport '@/utils/constants/x';",
        ['D11', 'C1'],
    ],
    [
        'features/x/canary.ts',
        "import '@/features/y/deep';\nimport '../y';\nimport '@/components/content-card/x';",
        ['D7', 'D9', 'D10'],
    ],
    ...LEAVES.map((f) => [
        `features/${f}/canary.ts`,
        "import '@/features/x';",
        ['D8'],
    ]),
    ['features/x/queries.ts', "import 'react';", ['D12']],
    ['features/filters/queries.ts', "import '@/features/x/queries';", ['D8']],
    ['components/x/canary.ts', "import '@/features/x';", ['D2']],
    ['components/content-card/canary.ts', "import '@/features/x';", ['D2']],
    ['components/plate/canary.ts', "import '@/features/x';", ['D2']],
    ['components/ui/canary.ts', "import '@/features/x';", ['D3']],
    ['components/icons/canary.ts', "import '@/utils/x';", ['D4']],
    ['services/canary.ts', "import '@/features/x';", ['D5']],
    [
        'utils/canary.ts',
        "import '@/services/x';\nexport const a = process.env.A;\nexport enum E {\n    A,\n}",
        ['D5', 'lint/style/noProcessEnv', 'lint/style/noEnum'],
    ],
    ['utils/labels/canary.ts', "import 'react';", ['D12']],
    [
        'components/canary.tsx',
        'const Component = () => null;\nexport default Component;',
        ['G4'],
    ],
    ['components/x/index.tsx', 'export {};', ['G2']],
    ['utils/constants/canary.ts', 'export {};', ['G3']],
    [
        'utils/cycle-a.ts',
        "import { b } from './cycle-b';\nexport const a = () => b;",
        ['lint/suspicious/noImportCycles'],
    ],
    [
        'utils/cycle-b.ts',
        "import { a } from './cycle-a';\nexport const b = () => a;",
        ['lint/suspicious/noImportCycles'],
    ],
];

class RatchetError extends Error {}

const fail = (message) => {
    throw new RatchetError(message);
};

const tagOf = (d) => TAG.exec(d.message)?.slice(1).find(Boolean);

const parseReport = (text, source) => {
    let report;
    try {
        report = JSON.parse(text);
    } catch {
        fail(
            `${source} is not a Biome JSON report (Biome could not load its configuration or a plugin; see its output above)`,
        );
    }
    const { diagnostics, summary } = report;
    if (!Array.isArray(diagnostics) || summary?.diagnosticsNotPrinted !== 0) {
        fail(`${source} is truncated; run biome with --max-diagnostics=none`);
    }
    const broken = diagnostics.filter(
        (d) => d.category === 'plugin' && !tagOf(d),
    );
    if (broken.length > 0) {
        fail(
            `a plugin failed or reported an untagged diagnostic:\n  ${broken
                .map((d) => `${d.location.path}: ${d.message}`)
                .join('\n  ')}`,
        );
    }
    return diagnostics;
};

const checkCanaries = () => {
    const dir = mkdtempSync(join(tmpdir(), 'lint-canary-'));
    try {
        const config = JSON.parse(
            readFileSync(join(ROOT, 'biome.json'), 'utf8'),
        );
        config.vcs = { enabled: false };
        writeFileSync(join(dir, 'biome.json'), JSON.stringify(config));
        cpSync(
            join(ROOT, 'apps/web/biome-plugins'),
            join(dir, 'apps/web/biome-plugins'),
            { recursive: true },
        );
        for (const [path, source] of CANARIES) {
            const file = join(dir, 'apps/web/src', path);
            mkdirSync(dirname(file), { recursive: true });
            writeFileSync(file, `${source}\n`);
        }
        const run = spawnSync(
            existsSync(LOCAL_BIOME) ? LOCAL_BIOME : 'biome',
            [
                'lint',
                '--reporter=json',
                '--max-diagnostics=none',
                'apps/web/src',
            ],
            { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26 },
        );
        if (run.error || !run.stdout?.trim()) {
            fail(
                `biome failed on the canaries: ${run.error?.message ?? run.stderr}`,
            );
        }
        const diagnostics = parseReport(run.stdout, 'the canary run');
        const missing = CANARIES.flatMap(([path, , tags]) => {
            const got = diagnostics
                .filter((d) => d.location.path === `apps/web/src/${path}`)
                .map((d) => tagOf(d) ?? d.category);
            return tags
                .filter((tag) => !got.includes(tag))
                .map((tag) => `${path}: ${tag}`);
        });
        if (missing.length > 0) {
            fail(
                `canary violations no longer reported (an override or plugin stopped applying):\n  ${missing.join('\n  ')}`,
            );
        }
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
};

const main = () => {
    const diagnostics = parseReport(readFileSync(0, 'utf8'), 'stdin');
    checkCanaries();

    const hits = {};
    for (const d of diagnostics) {
        const tag = tagOf(d);
        if (!tag) continue;
        hits[tag] ??= [];
        hits[tag].push(`${d.location.path}:${d.location.start.line}`);
    }
    const counts = Object.fromEntries(
        Object.keys(hits)
            .sort()
            .map((tag) => [tag, hits[tag].length]),
    );

    if (process.argv.includes('--update')) {
        writeFileSync(BASELINE, `${JSON.stringify(counts, null, 4)}\n`);
        console.log(`lint-ratchet: baseline written ${JSON.stringify(counts)}`);
        return;
    }

    const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'));
    const problems = [];
    for (const tag of new Set([
        ...Object.keys(baseline),
        ...Object.keys(counts),
    ])) {
        const now = counts[tag] ?? 0;
        const locked = baseline[tag] ?? 0;
        if (now > locked) {
            problems.push(
                `${tag}: ${now} > baseline ${locked}\n  ${hits[tag].join('\n  ')}`,
            );
        } else if (now < locked) {
            problems.push(
                `${tag}: ${now} < baseline ${locked}; if the fix is real, lock it in with --update`,
            );
        }
    }
    if (problems.length > 0) fail(`\n${problems.join('\n')}`);
    console.log(`lint-ratchet: ok ${JSON.stringify(counts)}`);
};

try {
    main();
} catch (error) {
    if (!(error instanceof RatchetError)) throw error;
    console.error(`lint-ratchet: ${error.message}`);
    process.exitCode = 1;
}
