import { describe, expect, it } from 'vitest';

import { parseTextFromMarkDown } from './markdown';

describe('parseTextFromMarkDown', () => {
    it('strips strikethrough syntax', () => {
        expect(parseTextFromMarkDown('one and ~~two~~').trim()).toBe(
            'one and two',
        );
    });
});
