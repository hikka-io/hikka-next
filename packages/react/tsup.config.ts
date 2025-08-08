import { Options, defineConfig } from 'tsup';

const commonConfig: Options = {
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    shims: false,
    splitting: false,
    minify: true,
    tsconfig: './tsconfig.build.json', // Use build config to avoid composite issues
    external: [
        'react',
        '@hikka/client',
        '@tanstack/react-query',
        'react-intersection-observer',
    ],
    outExtension({ format }) {
        return format === 'esm' ? { js: '.mjs' } : { js: '.cjs' };
    },
};

export default defineConfig([
    {
        ...commonConfig,
        entry: {
            index: 'client/index.ts',
        },
        outDir: 'dist',
    },
    {
        ...commonConfig,
        entry: {
            index: 'server/index.ts',
        },
        outDir: 'dist/server',
    },
    {
        ...commonConfig,
        entry: {
            index: 'core/index.ts',
        },
        outDir: 'dist/core',
    },
    {
        ...commonConfig,
        entry: {
            index: 'utils/index.ts',
        },
        outDir: 'dist/utils',
    },
]);
