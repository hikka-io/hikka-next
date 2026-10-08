import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import * as gen from './gen/zod.gen';
import { API_LIMITS } from './limits';

type Bound = 'min' | 'max';
type Range = Partial<Record<Bound, number>>;
type Check = {
    kind: string;
    value?: number;
    inclusive?: boolean;
    regex?: RegExp;
};

// Reads zod v3 internals (`_def.checks`, `_def.innerType`, array `_def.minLength`); rewrite for zod 4.
const zodV3 = {
    unwrap(schema: z.ZodTypeAny): z.ZodTypeAny {
        const inner = schema._def.innerType as z.ZodTypeAny | undefined;
        return inner ? zodV3.unwrap(inner) : schema;
    },

    range(schema: z.ZodTypeAny): Record<Bound, number | null> {
        const def = zodV3.unwrap(schema)._def;

        if (def.typeName === z.ZodFirstPartyTypeKind.ZodArray) {
            return {
                min: def.minLength?.value ?? null,
                max: def.maxLength?.value ?? null,
            };
        }

        if (
            def.typeName !== z.ZodFirstPartyTypeKind.ZodString &&
            def.typeName !== z.ZodFirstPartyTypeKind.ZodNumber
        ) {
            throw new Error(`no length or range reader for ${def.typeName}`);
        }

        const read = (kind: Bound) => {
            const checks = (def.checks as Check[]).filter(
                (check) => check.kind === kind,
            );

            if (checks.length > 1 || checks[0]?.inclusive === false) {
                throw new Error(`${kind} is not a single inclusive bound`);
            }

            return checks[0]?.value ?? null;
        };

        return { min: read('min'), max: read('max') };
    },

    pattern(schema: z.ZodTypeAny): RegExp | undefined {
        const checks = (zodV3.unwrap(schema)._def.checks ?? []) as Check[];

        return checks.find((check) => check.kind === 'regex')?.regex;
    },
};

const field = (ref: string): z.ZodTypeAny => {
    const [schemaName, key] = ref.split('.');
    const schema = (gen as Record<string, unknown>)[schemaName];
    const carrier =
        schema instanceof z.ZodObject
            ? (schema.shape as Record<string, z.ZodTypeAny>)[key]
            : undefined;

    if (!carrier) {
        throw new Error(`${ref} is not in zod.gen.ts`);
    }

    return carrier;
};

const limitAt = (path: string): Range =>
    path
        .split('.')
        .reduce<unknown>(
            (node, key) => (node as Record<string, unknown>)[key],
            API_LIMITS,
        ) as Range;

const leafPaths = (node: object, prefix = ''): string[] =>
    Object.entries(node).flatMap(([key, value]) =>
        typeof value === 'object'
            ? leafPaths(value, `${prefix}${key}.`)
            : [`${prefix}${key}`],
    );

const PAGE_SIZE_FIELDS = Object.entries(gen)
    .filter(
        ([name, schema]) =>
            name.endsWith('Query') &&
            schema instanceof z.ZodObject &&
            'size' in schema.shape,
    )
    .map(([name]) => `${name}.size`);

const RANGE_PINS: Record<string, string[]> = {
    password: [
        'zConfirmResetArgs.password',
        'zEmailLoginArgs.password',
        'zPasswordArgs.password',
        'zSignupArgs.password',
        'zUsernameLoginArgs.password',
    ],
    clientName: ['zClientCreate.name', 'zClientUpdate.name'],
    clientDescription: [
        'zClientCreate.description',
        'zClientUpdate.description',
    ],
    profileDescription: [
        'zDescriptionArgs.description',
        'zUpdateUserBody.description',
    ],
    listNote: [
        'zReadArgs.note',
        'zWatchArgs.note',
        'zReadResponse.note',
        'zReadResponseBase.note',
        'zWatchResponse.note',
        'zWatchResponseBase.note',
    ],
    listProgress: [
        'zReadArgs.chapters',
        'zReadArgs.volumes',
        'zWatchArgs.episodes',
        'zImportReadArgs.my_read_chapters',
        'zImportReadArgs.my_read_volumes',
        'zImportWatchArgs.my_watched_episodes',
    ],
    listRepeats: ['zReadArgs.rereads', 'zWatchArgs.rewatches'],
    listScore: [
        'zReadArgs.score',
        'zWatchArgs.score',
        'zImportReadArgs.my_score',
        'zImportWatchArgs.my_score',
    ],
    commentText: ['zCommentArgs.text', 'zCommentTextArgs.text'],
    articleTitle: ['zArticleArgs.title'],
    collectionTitle: ['zCollectionArgs.title'],
    collectionDescription: ['zCollectionArgs.description'],
    tags: [
        'zArticleArgs.tags',
        'zArticlesListArgs.tags',
        'zCollectionArgs.tags',
        'zCollectionsListArgs.tags',
    ],
    searchQuery: [
        'zAnimeSearchArgs.query',
        'zAnimeTodoArgs.query',
        'zCharacterTodoArgs.query',
        'zCompaniesListArgs.query',
        'zMangaSearchArgs.query',
        'zMangaTodoArgs.query',
        'zNovelSearchArgs.query',
        'zNovelTodoArgs.query',
        'zPersonTodoArgs.query',
        'zQuerySearchArgs.query',
    ],
    userSearchQuery: ['zQuerySearchRequiredArgs.query'],
    pageSize: PAGE_SIZE_FIELDS,
    'oklch.l': ['zOklchColor.l'],
    'oklch.c': ['zOklchColor.c'],
    'oklch.h': ['zOklchColor.h'],
};

const PATTERN_PINS: Record<string, string[]> = {
    username: [
        'zSignupArgs.username',
        'zUsernameArgs.username',
        'zUsernameLoginArgs.username',
    ],
};

const rangeRows = Object.entries(RANGE_PINS).flatMap(([path, refs]) =>
    Object.entries(limitAt(path)).flatMap(([bound, expected]) =>
        refs.map((ref) => ({
            leaf: `${path}.${bound}`,
            ref,
            bound: bound as Bound,
            expected,
        })),
    ),
);

const patternRows = Object.entries(PATTERN_PINS).flatMap(([path, refs]) =>
    refs.map((ref) => ({ path, ref })),
);

describe('API_LIMITS', () => {
    it.each(rangeRows)('$leaf equals $ref', ({ ref, bound, expected }) => {
        expect(zodV3.range(field(ref))[bound]).toBe(expected);
    });

    it.each(patternRows)('$path equals the $ref pattern', ({ path, ref }) => {
        const { min, max } = limitAt(path) as Required<Range>;

        expect(String(zodV3.pattern(field(ref)))).toBe(
            `/^[A-Za-z][A-Za-z0-9_]{${min - 1},${max - 1}}$/`,
        );
    });

    it('pins the page size against every paginated query', () => {
        expect(PAGE_SIZE_FIELDS.length).toBeGreaterThan(1);
        expect(PAGE_SIZE_FIELDS).toContain('zThreadQuery.size');
    });

    it('pins every leaf', () => {
        const pinned = new Set([
            ...rangeRows.map((row) => row.leaf),
            ...Object.keys(PATTERN_PINS).flatMap((path) =>
                Object.keys(limitAt(path)).map((bound) => `${path}.${bound}`),
            ),
        ]);

        expect([...pinned].sort()).toEqual(leafPaths(API_LIMITS).sort());
    });
});
