// Checks apps/web/src against Rules F, P, D, H and B (CLAUDE.md); --self-test proves each check fires.
import {
    mkdirSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const DISPLAY_PREFIX = 'apps/web/src/';
const FORBIDDEN_FOLDERS = new Set([
    'hooks',
    'types',
    'constants',
    'stores',
    'providers',
    'helpers',
    'lib',
    'api',
]);
const SANCTIONED_FOLDERS = new Set(['services/hooks', 'utils/api']);
const ROLE_FOLDERS = new Set(['components', 'utils']);
const IGNORED = {
    'features/about': 'untracked local stray kept by owner decision O14',
    'features:': 'untracked local stray kept by owner decision O14',
};
const REEXPORT =
    /export\s+(?:type\s+)?(?:\*(?:\s+as\s+[\w$]+)?|\{[^}]*\})\s+from\s+(['"])[^'"\n]+\1\s*;?/g;
const COMMENT = /\/\*[\s\S]*?\*\/|(^|\s)\/\/.*$/gm;

const walk = (root) => {
    const folders = [];
    const visit = (rel) => {
        const files = [];
        const subfolders = [];
        for (const entry of readdirSync(join(root, rel), {
            withFileTypes: true,
        })) {
            const path = rel ? `${rel}/${entry.name}` : entry.name;
            if (entry.name.startsWith('.') || path in IGNORED) continue;
            if (entry.isDirectory()) subfolders.push(entry.name);
            else if (entry.isFile()) files.push(entry.name);
        }
        folders.push({ rel, files, subfolders });
        for (const name of subfolders) visit(rel ? `${rel}/${name}` : name);
    };
    visit('');
    return folders;
};

const isRuleFExempt = (segments) =>
    segments.length === 1 ||
    (segments[0] === 'components' && segments[1] === 'plate') ||
    (segments[0] === 'components' &&
        segments[1] === 'icons' &&
        segments.length === 3);

const checkFolder = ({ rel, files, subfolders }, report, notes) => {
    const segments = rel.split('/');
    const [root] = segments;
    const name = segments.at(-1);
    const depth = segments.length;
    if (root === 'routes') return;

    if (FORBIDDEN_FOLDERS.has(name) && !SANCTIONED_FOLDERS.has(rel)) {
        if (name === 'hooks') {
            report(
                rel,
                'H',
                'hooks/ folder outside services/hooks (use flat use-*.ts files)',
            );
        } else {
            report(
                rel,
                'P',
                `"${name}/" is a forbidden role folder (use flat types.ts, constants.ts, *-store.ts or *-provider.tsx files)`,
            );
        }
    }

    if (
        root === 'features' &&
        depth >= 3 &&
        ROLE_FOLDERS.has(name) &&
        subfolders.length > 0
    ) {
        report(
            rel,
            'P',
            `role folder ${name}/ contains subfolders (it may hold only files)`,
        );
    }

    if (root === 'features' && depth === 5 && !ROLE_FOLDERS.has(name)) {
        report(
            rel,
            'D',
            'the third folder level inside a feature may only be components/ or utils/',
        );
    } else if (root === 'features' && depth > 5) {
        report(rel, 'D', 'more than three folder levels inside a feature');
    } else if (root === 'components' && segments[1] !== 'plate' && depth > 3) {
        report(
            rel,
            'D',
            'more than one subfolder level inside a components/ group',
        );
    } else if ((root === 'utils' || root === 'services') && depth > 2) {
        report(rel, 'D', `more than one folder level inside ${root}/`);
    }

    if (isRuleFExempt(segments) || subfolders.length > 0) return;
    const counted = files.filter(
        (file) => file !== 'index.ts' && !/\.test\.[cm]?[jt]sx?$/.test(file),
    ).length;
    if (counted < 2) {
        report(
            rel,
            'F',
            `holds ${counted} file(s); a folder needs 3+ (move the file up and delete the folder and its barrel)`,
        );
    } else if (counted === 2) {
        notes.push(rel);
    }
};

const checkFile = (root, rel, report) => {
    const [top] = rel.split('/');
    const name = rel.split('/').at(-1);
    if (top === 'routes' || !/\.(?:[cm]?[jt]sx?)$/.test(name)) return;
    const source = readFileSync(join(root, rel), 'utf8');

    if (name === 'index.tsx') {
        report(rel, 'B', 'index.tsx outside routes/ (barrels are index.ts)');
    }
    if (name === 'index.ts') {
        const rest = source.replace(REEXPORT, '').replace(COMMENT, '$1').trim();
        if (rest) {
            report(
                rel,
                'B',
                `barrel holds more than re-exports: "${rest.split('\n')[0].trim()}"`,
            );
        }
    }
    if (
        /^use-[^.]+\.tsx?$/.test(name) &&
        /^\s*export\s+default\b|\bas\s+default\b/m.test(source)
    ) {
        report(rel, 'H', 'hook file has a default export (use a named export)');
    }
    if (
        name.endsWith('.d.ts') &&
        /\bdeclare\s+global\b|\bnamespace\s+[\w$]+/.test(source)
    ) {
        report(
            rel,
            'ambient',
            'declare global / namespace in a .d.ts (declare types in their owner module)',
        );
    } else if (/\bnamespace\s+Hikka\b/.test(source)) {
        report(
            rel,
            'ambient',
            'Hikka namespace (declare types in their owner module)',
        );
    }
};

const check = (root) => {
    const violations = [];
    const notes = [];
    const report = (path, rule, message) =>
        violations.push({ path, rule, message });
    for (const folder of walk(root)) {
        if (folder.rel) checkFolder(folder, report, notes);
        for (const file of folder.files) {
            checkFile(
                root,
                folder.rel ? `${folder.rel}/${file}` : file,
                report,
            );
        }
    }
    violations.sort((a, b) => a.path.localeCompare(b.path));
    return { violations, notes: notes.sort() };
};

const FIXTURE = {
    'features/a/a.tsx': '',
    'features/a/b.tsx': '',
    'features/a/index.ts':
        "export { default as A } from './a';\nconst b = 1;\nexport { b };",
    'features/a/one/x.tsx': '',
    'features/a/one/x.test.tsx': '',
    'features/a/one/index.ts': "export { default } from './x';",
    'features/a/empty/': null,
    'features/a/two/x.tsx': '',
    'features/a/two/y.tsx': '',
    'features/a/hooks/use-a.ts': '',
    'features/a/hooks/use-b.ts': '',
    'features/a/hooks/use-c.ts': '',
    'features/a/types/a.ts': '',
    'features/a/types/b.ts': '',
    'features/a/types/c.ts': '',
    'features/a/components/x.tsx': '',
    'features/a/components/y.tsx': '',
    'features/a/components/z.tsx': '',
    'features/a/components/nested/x.tsx': '',
    'features/a/components/nested/y.tsx': '',
    'features/a/components/nested/z.tsx': '',
    'features/a/deep/deeper/deepest/x.tsx': '',
    'features/a/deep/deeper/deepest/y.tsx': '',
    'features/a/deep/deeper/deepest/z.tsx': '',
    'features/a/deep/deeper/components/x.tsx': '',
    'features/a/deep/deeper/components/y.tsx': '',
    'features/a/deep/deeper/components/z.tsx': '',
    'features/b/a.tsx': '',
    'features/b/b.tsx': '',
    'features/b/c.tsx': '',
    'features/b/index.ts':
        "// barrel\nexport { default as A } from './a';\nexport {\n    default as B,\n    type C, // note\n} from './b';\n/* block */\nexport * from './c';\nexport type * as T from './c';",
    'features/about/prototype/': null,
    'features:': 'services-',
    'components/g/a.tsx': '',
    'components/g/b.tsx': '',
    'components/g/index.tsx': '',
    'components/g/sub/a.tsx': '',
    'components/g/sub/b.tsx': '',
    'components/g/sub/c.tsx': '',
    'components/g/sub/deep/a.tsx': '',
    'components/g/sub/deep/b.tsx': '',
    'components/g/sub/deep/c.tsx': '',
    'components/icons/mdi/x.tsx': '',
    'components/plate/editor/value/deep/x.ts': '',
    'services/hooks/use-thing.ts': 'export default function useThing() {}',
    'services/hooks/use-other.ts': 'export function useOther() {}',
    'services/hooks/use-third.ts':
        'const useThird = () => 1;\nexport { useThird };',
    'utils/api/a.ts': '',
    'utils/api/b.ts': '',
    'utils/api/c.ts': '',
    'utils/area/ambient.d.ts': 'declare global {\n    interface Window {}\n}',
    'utils/area/hikka.ts': 'export declare namespace Hikka {}',
    'utils/area/x.ts': '',
    'utils/area/nested/a.ts': '',
    'utils/area/nested/b.ts': '',
    'utils/area/nested/c.ts': '',
    'routes/api/og/x.ts': 'export default 1;',
    'routes/index.tsx': '',
    'types/hikka.d.ts': 'declare global {\n    namespace Hikka {}\n}',
    'vite-env.d.ts': "declare module 'x';\ninterface ImportMeta {}",
};

const EXPECTED = [
    'components/g/index.tsx: B',
    'components/g/sub/deep: D',
    'features/a/components: P',
    'features/a/deep/deeper/deepest: D',
    'features/a/empty: F',
    'features/a/hooks: H',
    'features/a/index.ts: B',
    'features/a/one: F',
    'features/a/types: P',
    'services/hooks/use-thing.ts: H',
    'types: P',
    'types/hikka.d.ts: ambient',
    'utils/area/ambient.d.ts: ambient',
    'utils/area/hikka.ts: ambient',
    'utils/area/nested: D',
];

const selfTest = () => {
    const dir = mkdtempSync(join(tmpdir(), 'check-structure-'));
    try {
        for (const [path, source] of Object.entries(FIXTURE)) {
            const target = join(dir, path);
            if (source === null) {
                mkdirSync(target, { recursive: true });
            } else {
                mkdirSync(dirname(target), { recursive: true });
                writeFileSync(target, `${source}\n`);
            }
        }
        const { violations, notes } = check(dir);
        const got = violations.map((v) => `${v.path}: ${v.rule}`);
        return [
            ...EXPECTED.filter((e) => !got.includes(e)).map(
                (e) => `missing ${e}`,
            ),
            ...got
                .filter((g) => !EXPECTED.includes(g))
                .map((g) => `unexpected ${g}`),
            ...(notes.join() === 'features/a/two'
                ? []
                : [`notes ${JSON.stringify(notes)}`]),
        ];
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
};

if (process.argv.includes('--self-test')) {
    const problems = selfTest();
    if (problems.length > 0) {
        console.error(
            `check-structure: self-test failed:\n  ${problems.join('\n  ')}`,
        );
        process.exit(1);
    }
    console.log('check-structure: self-test ok');
    process.exit(0);
}

const { violations, notes } = check(SRC);
for (const { path, rule, message } of violations) {
    console.error(`${DISPLAY_PREFIX}${path}: ${rule}: ${message}`);
}
console.log(
    `check-structure: note: ${notes.length} existing two-file folders tolerated by Rule F`,
);
if (process.argv.includes('--verbose')) {
    for (const path of notes) console.log(`  ${DISPLAY_PREFIX}${path}`);
}
if (violations.length > 0) {
    console.error(`check-structure: ${violations.length} violation(s)`);
    process.exit(1);
}
console.log('check-structure: ok');
