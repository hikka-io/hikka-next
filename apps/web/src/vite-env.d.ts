/// <reference types="vite/client" />

// Font packages ship CSS only and provide no type declarations; declare them
// so their side-effect imports satisfy `noUncheckedSideEffectImports`.
declare module '@fontsource-variable/geist';

interface ImportMetaEnv {
    readonly VITE_IMGPROXY_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
