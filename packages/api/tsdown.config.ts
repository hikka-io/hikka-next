import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    shims: true,
    minify: true,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
});
