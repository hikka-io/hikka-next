import { describe, expect, it } from 'vitest';

import {
    getWatchTime,
    READ_STATUS_ORDER,
    WATCH_STATUS_ORDER,
} from './user-list-stats';

describe('status order', () => {
    it('lists completed first and on hold last', () => {
        expect(WATCH_STATUS_ORDER).toEqual([
            'completed',
            'watching',
            'planned',
            'dropped',
            'on_hold',
        ]);
        expect(READ_STATUS_ORDER).toEqual([
            'completed',
            'reading',
            'planned',
            'dropped',
            'on_hold',
        ]);
    });
});

describe('getWatchTime', () => {
    it('shows days alone under a month', () => {
        expect(getWatchTime(60 * 24 * 5)).toEqual({
            hours: 120,
            label: '5 днів',
        });
    });

    it('splits months and days', () => {
        expect(getWatchTime(60 * 24 * 35).label).toBe('1 місяць 5 днів');
    });

    it('shows zero days for no time', () => {
        expect(getWatchTime(0)).toEqual({ hours: 0, label: '0 днів' });
    });
});
