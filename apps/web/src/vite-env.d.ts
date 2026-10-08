/// <reference types="vite/client" />

// Font packages ship CSS only and provide no type declarations; declare them
// so their side-effect imports satisfy `noUncheckedSideEffectImports`.
declare module '@fontsource-variable/geist';

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_SITE_URL?: string;
    readonly VITE_COOKIE_DOMAIN?: string;
    readonly VITE_IMGPROXY_URL?: string;
    /** Local development only: see `features/auth/captcha-config.ts`. */
    readonly VITE_CAPTCHA_BYPASS?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
