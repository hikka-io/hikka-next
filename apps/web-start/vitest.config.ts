import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Minimal config: reuse tsconfig path aliases, jsdom for DOM globals.
// The TanStack Start / Nitro / React Compiler plugins are intentionally
// omitted — unit targets here are pure logic, not rendered components.
export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});
