const SURFACE_CLASS_NAME =
    'relative isolate rounded-lg border border-border will-change-transform';

const SURFACE_VARIANTS = {
    surface: 'surface',
    inset: 'surface-inset',
    glass: 'surface-glass',
    plain: '',
} as const;

const FLUSH_ON_MOBILE_CLASS_NAME =
    '-mx-4 rounded-none border-x-0 md:mx-0 md:rounded-lg md:border-x';

const FLUSH_SURFACE_CLASS_NAME = `surface border border-border ${FLUSH_ON_MOBILE_CLASS_NAME}`;

const FLUSH_SURFACE_LIST_CLASS_NAME = 'max-md:[&>*+*]:-mt-px md:gap-6';

const FIRST_BLOCK_BLUR_CLASS_NAME =
    '[&>:first-child>[data-slot=block-surface]]:backdrop-blur [&>[data-slot=block-surface]:first-child]:backdrop-blur';

type SurfaceVariant = keyof typeof SURFACE_VARIANTS;

export {
    FIRST_BLOCK_BLUR_CLASS_NAME,
    FLUSH_ON_MOBILE_CLASS_NAME,
    FLUSH_SURFACE_CLASS_NAME,
    FLUSH_SURFACE_LIST_CLASS_NAME,
    SURFACE_CLASS_NAME,
    SURFACE_VARIANTS,
    type SurfaceVariant,
};
