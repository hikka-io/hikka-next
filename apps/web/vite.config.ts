import tailwindcss from '@tailwindcss/vite';
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tanstackDevtools(),
        tsconfigPaths(),
        tanstackStart(),
        nitro(),
        react({
            // plugin-react v5 no longer auto-excludes node_modules when a custom
            // `exclude` is provided (it replaces the default), so keep it explicit.
            exclude: [/utils\/og\//, /\/node_modules\//],
            babel: {
                plugins: [['babel-plugin-react-compiler', {}]],
            },
        }),
        tailwindcss(),
    ],
    resolve: {
        dedupe: ['react', 'react-dom', '@tanstack/react-query'],
    },
});
