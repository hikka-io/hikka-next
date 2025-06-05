import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true,
    minify: true,
    treeshake: true,
    tsconfig: './tsconfig.build.json', // Use build config to avoid composite issues
    outExtension({ format }) {
        return {
            js: format === 'cjs' ? '.js' : '.mjs',
        };
    },
});
