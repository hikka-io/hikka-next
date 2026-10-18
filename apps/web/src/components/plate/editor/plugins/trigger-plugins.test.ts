import { afterEach, describe, expect, it, vi } from 'vitest';

import { BLOCK_INSERT_KEY, SLASH_KEY } from './trigger-keys';
import { withoutTriggerPlugins } from './trigger-plugins';

const PLUGINS = [{ key: 'p' }, { key: SLASH_KEY }, { key: BLOCK_INSERT_KEY }];

const pointer = (coarse: boolean) =>
    vi.stubGlobal(
        'matchMedia',
        vi.fn(() => ({ matches: coarse }) as MediaQueryList),
    );

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('withoutTriggerPlugins', () => {
    it('keeps the triggers and the gutter for a mouse', () => {
        pointer(false);

        expect(withoutTriggerPlugins(PLUGINS)).toEqual(PLUGINS);
    });

    it('drops them on touch, where the toolbar replaces them', () => {
        pointer(true);

        expect(withoutTriggerPlugins(PLUGINS)).toEqual([{ key: 'p' }]);
    });
});
