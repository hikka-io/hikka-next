import { Options, defineConfig } from 'tsup';

const commonConfig: Options = {
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    shims: false,
    splitting: false,
    minify: true,
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
        entry: ['client/index.ts'],
        outDir: 'dist',
    },
    {
        ...commonConfig,
        entry: ['server/index.ts'],
        outDir: 'dist/server',
    },
    {
        ...commonConfig,
        entry: ['core/index.ts'],
        outDir: 'dist/core',
    },
    {
        ...commonConfig,
        entry: ['utils/index.ts'],
        outDir: 'dist/utils',
    },
]);
