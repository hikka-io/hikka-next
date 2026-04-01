/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IMGPROXY_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
