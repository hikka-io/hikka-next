import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tanstackDevtools(),
        tsconfigPaths(),
        tanstackStart(),
        react({
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
