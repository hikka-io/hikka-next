import { defineConfig } from '@hey-api/openapi-ts';

import { transformSpec } from './scripts/transform-spec';

const SPEC_URL =
    process.env.HIKKA_OPENAPI_URL ?? 'https://api.hikka.io/openapi.json';

const TIMESTAMP_DATE_SCHEMAS = new Set(['WatchArgs', 'ReadArgs']);
const TIMESTAMP_DATE_FIELDS = ['start_date', 'end_date'] as const;

/**
 * Hikka list/search endpoints are POST (filters in the body, `page`/`size` in
 * the query) but are semantically queries. hey-api defaults POST -> mutation,
 * so we classify these paths as query operations to get query + infinite
 * options generated for them.
 */
const QUERY_POST_PATHS = new Set([
    '/anime',
    '/manga',
    '/novel',
    '/characters',
    '/people',
    '/companies',
    '/collections',
    '/articles',
    '/schedule/anime',
    '/client/all',
    '/edit/list',
    '/edit/todo/anime',
    '/edit/todo/manga',
    '/edit/todo/novel',
    '/edit/todo/characters',
    '/edit/todo/people',
    '/user/list',
    '/favourite/{content_type}/{username}/list',
    '/watch/{username}/list',
    '/read/{content_type}/{username}/list',
    '/feed',
    '/comments/{content_type}/{slug}/list',
    '/comments/user/{username}',
]);

export default defineConfig({
    input: {
        path: SPEC_URL,
        fetch: { headers: { 'User-Agent': 'hikka-codegen' } },
    },
    output: { path: './src/gen', postProcess: [] },
    parser: {
        patch: {
            input: (spec) => {
                transformSpec(
                    spec as unknown as Parameters<typeof transformSpec>[0],
                );
            },
            // The API takes these list dates as Unix timestamps; the spec mistypes them as date-time strings.
            schemas: (name, schema) => {
                if (!TIMESTAMP_DATE_SCHEMAS.has(name)) return;

                for (const field of TIMESTAMP_DATE_FIELDS) {
                    const property = schema.properties?.[field];

                    if (typeof property === 'object' && 'anyOf' in property) {
                        property.anyOf = [
                            { type: 'integer' },
                            { type: 'null' },
                        ];
                    }
                }
            },
        },
        hooks: {
            operations: {
                isQuery: (op) =>
                    op.method === 'post' && QUERY_POST_PATHS.has(op.path)
                        ? true
                        : undefined,
            },
        },
    },
    plugins: [
        { name: '@hey-api/client-fetch', baseUrl: false },
        { name: '@hey-api/typescript', enums: 'javascript' },
        { name: '@hey-api/sdk', validator: { response: 'zod' } },
        'zod',
        {
            name: '@tanstack/react-query',
            queryOptions: true,
            infiniteQueryOptions: true,
            mutationOptions: true,
            queryKeys: true,
            infiniteQueryKeys: true,
        },
    ],
});
