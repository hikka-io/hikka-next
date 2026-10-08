import type { UIEffect } from '@/utils/customization';

type EffectMeta = {
    label: string;
    description: string;
};

export const EFFECTS = {
    snowfall: {
        label: 'Сніжинки ❄️',
        description: 'Включити анімацію сніжинок на сайті',
    },
    sakura: {
        label: 'Сакура 🌸',
        description: 'Включити анімацію пелюсток сакури на сайті',
    },
} as const satisfies Record<UIEffect, EffectMeta>;

export const EFFECT_IDS = Object.keys(EFFECTS) as readonly UIEffect[];
