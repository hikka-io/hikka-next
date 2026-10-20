const SURFACE_CLASS_NAME =
    'relative isolate rounded-lg border border-border will-change-transform';

const SURFACE_VARIANTS = {
    surface: 'surface',
    inset: 'surface-inset',
    glass: 'surface-glass',
    plain: '',
} as const;

const FIRST_BLOCK_BLUR_CLASS_NAME =
    '[&>:first-child>[data-slot=block-surface]]:backdrop-blur [&>[data-slot=block-surface]:first-child]:backdrop-blur';

type SurfaceVariant = keyof typeof SURFACE_VARIANTS;

export {
    FIRST_BLOCK_BLUR_CLASS_NAME,
    SURFACE_CLASS_NAME,
    SURFACE_VARIANTS,
    type SurfaceVariant,
};
