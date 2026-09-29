import { describe, expect, it } from 'vitest';

import {
    LIST_STATUS_ICONS,
    READ_STATUS_ICONS,
    WATCH_STATUS_ICONS,
} from './list-status-icons';

describe('LIST_STATUS_ICONS', () => {
    it('picks the watch and read icon maps by kind', () => {
        expect(LIST_STATUS_ICONS.watch).toBe(WATCH_STATUS_ICONS);
        expect(LIST_STATUS_ICONS.read).toBe(READ_STATUS_ICONS);
    });

    it('lets read win the shared keys when merged after watch', () => {
        const merged = {
            ...LIST_STATUS_ICONS.watch,
            ...LIST_STATUS_ICONS.read,
        };

        expect(Object.keys(merged)).toEqual([
            'planned',
            'watching',
            'completed',
            'on_hold',
            'dropped',
            'reading',
        ]);
        expect(merged.on_hold).toBe(READ_STATUS_ICONS.on_hold);
        expect(merged.on_hold).not.toBe(WATCH_STATUS_ICONS.on_hold);
        expect(merged.watching).toBe(WATCH_STATUS_ICONS.watching);
        expect(merged.reading).toBe(READ_STATUS_ICONS.reading);
    });
});
