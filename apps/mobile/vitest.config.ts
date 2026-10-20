import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: { tsconfigPaths: true },
    test: {
        environment: 'node',
        globals: true,
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});
