export const PETAL_COUNT_DESKTOP = 36;
export const PETAL_COUNT_MOBILE = 16;
export const AMBIENT_COUNT_DESKTOP = 15;
export const AMBIENT_COUNT_MOBILE = 6;

export const BRANCH_TOP_OFFSET_DESKTOP = 32;
export const BRANCH_TOP_OFFSET_MOBILE = 28;

export const TARGET_FRAME_TIME = 1000 / 60;

export const MAX_RENDER_SCALE_DESKTOP = 2;
export const MAX_RENDER_SCALE_MOBILE = 1.5;

/**
 * Watchdog for the render-scale fallback. slowFrameMs 22 ≈ sustained
 * below ~45fps. Note: browsers that cap rAF at 30Hz (battery saver) will
 * trip this and drop to 1× — deliberate; erring toward performance is the
 * whole point of the guardrail. windowSize 120 ≈ evaluate every 2s @60fps.
 */
export const FRAME_HEALTH = {
    slowFrameMs: 22,
    windowSize: 120,
    slowRatio: 0.5,
    ignoreAboveMs: 250,
} as const;

export const PETAL_PALETTES = [
    { base: '#F9A8B8', tip: '#E8718A', highlight: '#FFDDE4' },
    { base: '#F4929E', tip: '#E05A78', highlight: '#FFD1DC' },
    { base: '#FFB0C1', tip: '#F07A94', highlight: '#FFE0E8' },
    { base: '#F7A0B5', tip: '#E66B88', highlight: '#FFDAE3' },
] as const;

export type PetalPalette = (typeof PETAL_PALETTES)[number];

export const AMBIENT_COLORS = ['#FFF5E6', '#FFE4B5', '#FFFAF0'] as const;
