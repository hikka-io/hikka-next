import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        tanstackStart({
            react: {
                babel: {
                    plugins: [['babel-plugin-react-compiler', {}]],
                },
            },
        }),
        tailwindcss(),
    ],
});
