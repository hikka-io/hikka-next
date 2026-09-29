import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: {
        // tsc emits DataTag's computed symbol keys without importing the symbols
        banner: "import { dataTagErrorSymbol, dataTagSymbol } from '@tanstack/react-query';",
    },
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true,
    minify: true,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
});
