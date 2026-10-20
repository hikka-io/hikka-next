import { describe, expect, it } from 'vitest';

import { formatTimeAgo } from './relative-time';

const NOW = Date.UTC(2026, 9, 2, 12);
const ago = (seconds: number) => NOW / 1000 - seconds;

describe('formatTimeAgo', () => {
    it.each([
        [20, '20 секунд тому'],
        [5 * 60, '5 хвилин тому'],
        [3 * 3600, '3 години тому'],
        [26 * 3600, '1 день тому'],
        [5 * 86400, '5 днів тому'],
        [40 * 86400, '1 місяць тому'],
        [400 * 86400, '1 рік тому'],
    ])('formats %i seconds ago', (seconds, text) => {
        expect(formatTimeAgo(ago(seconds), NOW)).toBe(text);
    });
});
