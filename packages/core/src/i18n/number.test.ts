import { describe, expect, it } from 'vitest';

import { formatCompactNumber } from './number';

describe('formatCompactNumber', () => {
    it.each([
        [0, '0'],
        [7, '7'],
        [999, '999'],
        [1000, '1K'],
        [1175, '1.2K'],
        [1950, '2K'],
        [12345, '12.3K'],
        [999999, '1M'],
        [3113597, '3.1M'],
        [1250000000, '1.3B'],
    ])('formats %d as %s', (value, expected) => {
        expect(formatCompactNumber(value)).toBe(expected);
    });
});
