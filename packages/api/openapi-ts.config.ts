import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
    input: './openapi.json',
    output: { path: './src/gen', postProcess: [] },
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
