import { defineConfig } from '@hey-api/openapi-ts';

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
    '/user/list',
    '/favourite/{content_type}/{username}/list',
    '/watch/{username}/list',
    '/read/{content_type}/{username}/list',
]);

export default defineConfig({
    input: './openapi.json',
    output: { path: './src/gen', postProcess: [] },
    parser: {
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
        '@hey-api/client-fetch',
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
