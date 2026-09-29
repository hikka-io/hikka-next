import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DATE_RANGE, getSeasonByOffset } from './season';

describe('getSeasonByOffset', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 4, 15));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('offers a window of four seasons each way', () => {
        expect(DATE_RANGE).toEqual([-4, 4]);
    });

    it('clamps offsets to the date range', () => {
        expect(getSeasonByOffset(-10)).toEqual(getSeasonByOffset(-4));
        expect(getSeasonByOffset(10)).toEqual(getSeasonByOffset(4));
        expect(getSeasonByOffset(4)).toEqual(['spring', 2027]);
    });
});
