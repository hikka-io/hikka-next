import tailwindcss from '@tailwindcss/vite';
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        tanstackDevtools(),
        tanstackStart(),
        nitro(),
        react({
            // A custom `exclude` replaces the default node_modules exclusion, so keep it explicit.
            exclude: [/utils\/og\//, /\/node_modules\//],
            compiler: true,
        }),
        tailwindcss(),
    ],
    resolve: {
        tsconfigPaths: true,
        dedupe: ['react', 'react-dom', '@tanstack/react-query', 'slate'],
    },
});
