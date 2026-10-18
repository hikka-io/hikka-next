const SURFACE_CLASS_NAME =
    'relative isolate rounded-lg border border-border will-change-transform';

const SURFACE_VARIANTS = {
    surface: 'surface',
    inset: 'surface-inset',
    glass: 'surface-glass',
    plain: '',
} as const;

type SurfaceVariant = keyof typeof SURFACE_VARIANTS;

export { SURFACE_CLASS_NAME, SURFACE_VARIANTS, type SurfaceVariant };
