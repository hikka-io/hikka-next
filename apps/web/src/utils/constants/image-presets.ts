export const IMAGE_PRESETS = {
    // Default: 5-col list pages with sidebar (~200px max card width, 2x retina)
    card: {
        width: 400,
        height: 572,
        sizes: '(min-width: 1280px) 196px, (min-width: 1024px) 170px, (min-width: 768px) 140px, (min-width: 640px) 30vw, calc(50vw - 24px)',
    },
    // Large: content detail cover (~480px max)
    cardLg: {
        width: 480,
        height: 686,
        sizes: '(min-width: 1280px) 306px, (min-width: 1024px) 212px, (min-width: 768px) 352px, (min-width: 640px) 480px, calc(100vw - 160px)',
    },
    // Small: 8-col home grid, 6-col favorites (~160px max, 2x retina)
    cardSm: {
        width: 320,
        height: 458,
        sizes: '(min-width: 1280px) 155px, (min-width: 768px) 130px, calc(25vw - 16px)',
    },
    // Extra small: HorizontalCard (w-12=48px), widget (w-10=40px), tracker (~56px)
    cardXs: {
        width: 112,
        height: 160,
        sizes: '56px',
    },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;
