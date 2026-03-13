import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { defineConfig } from 'vite';
import { nitro } from 'nitro/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        tanstackDevtools(),
        tsconfigPaths(),
        tanstackStart(),
        nitro(),
        react({
            exclude: [/utils\/og\//],
            babel: {
                plugins: [['babel-plugin-react-compiler', {}]],
            },
        }),
        tailwindcss(),
        visualizer({
            filename: 'stats.html',
            open: true,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    resolve: {
        dedupe: ['react', 'react-dom', '@tanstack/react-query'],
    },
});
