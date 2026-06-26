import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true,
    minify: true,
    treeshake: true,
    tsconfig: './tsconfig.build.json',
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.js' : '.mjs' };
    },
});
