import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['index.ts'],
    format: ['cjs', 'esm'],
    dts: process.env.NODE_ENV === 'production',
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true,
    minify: true,
    treeshake: true,
    tsconfig: './tsconfig.json', // Explicitly specify tsconfig for JS compilation
    outExtension({ format }) {
        return {
            js: format === 'cjs' ? '.js' : '.mjs',
        };
    },
});
