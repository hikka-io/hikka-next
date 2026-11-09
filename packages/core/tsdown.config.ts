import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    // keep .js / .d.ts output for this "type": "module" package
    fixedExtension: false,
    sourcemap: true,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
});
