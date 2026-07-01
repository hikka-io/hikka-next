import type { OklchColor } from '@hikka/api';

export type AccentPreset = {
    name: string;
    brand: OklchColor;
};

/**
 * Curated accent presets. Each is a single OKLCH brand color from which the
 * whole primary palette derives (see globals.css). "Рожевий" matches
 * DEFAULT_STYLES.brand.
 */
export const ACCENT_PRESETS: AccentPreset[] = [
    { name: 'Рожевий', brand: { l: 0.7, c: 0.18, h: 343 } },
    { name: 'Синій', brand: { l: 0.676, c: 0.126, h: 259.5 } },
    { name: 'Зелений', brand: { l: 0.829, c: 0.159, h: 153.3 } },
    { name: 'Помаранчевий', brand: { l: 0.751, c: 0.111, h: 55.7 } },
    { name: 'Фіолетовий', brand: { l: 0.637, c: 0.186, h: 304.8 } },
    { name: 'Червоний', brand: { l: 0.667, c: 0.156, h: 22.2 } },
    { name: 'Бірюзовий', brand: { l: 0.849, c: 0.111, h: 195.3 } },
];
