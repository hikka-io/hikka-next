import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: !options.watch,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
}));
