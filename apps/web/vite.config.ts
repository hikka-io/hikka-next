import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// A custom `exclude` replaces the plugins' default node_modules exclusion, so keep it explicit.
const REACT_EXCLUDE = [/utils\/og\//, /\/node_modules\//];

export default defineConfig({
    plugins: [
        tanstackDevtools(),
        tsconfigPaths(),
        tanstackStart(),
        nitro(),
        react({ exclude: REACT_EXCLUDE }),
        babel({ exclude: REACT_EXCLUDE, presets: [reactCompilerPreset()] }),
        tailwindcss(),
    ],
    resolve: {
        dedupe: ['react', 'react-dom', '@tanstack/react-query', 'slate'],
    },
});
