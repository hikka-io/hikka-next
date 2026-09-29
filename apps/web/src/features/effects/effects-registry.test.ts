import { describe, expect, expectTypeOf, it } from 'vitest';

import type { UIEffect } from '@/utils/customization';

import { EFFECT_IDS, EFFECTS } from './effects-registry';

const GENERATED_EFFECTS = {
    snowfall: true,
    sakura: true,
} satisfies Record<UIEffect, true>;

describe('EFFECTS', () => {
    it('is keyed by exactly the generated effect values', () => {
        expectTypeOf<keyof typeof EFFECTS>().toEqualTypeOf<UIEffect>();
        expect(Object.keys(EFFECTS).sort()).toEqual(
            Object.keys(GENERATED_EFFECTS).sort(),
        );
    });

    it('lists the ids in toggle order', () => {
        expect(EFFECT_IDS).toEqual(['snowfall', 'sakura']);
    });

    it.each(EFFECT_IDS)('has a label and description for %s', (id) => {
        expect(EFFECTS[id].label.trim()).not.toBe('');
        expect(EFFECTS[id].description.trim()).not.toBe('');
    });
});
