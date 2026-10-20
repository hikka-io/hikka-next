import { describe, expect, it } from 'vitest';

import { markdownPreview } from './markdown-preview';

describe('markdownPreview', () => {
    it('drops formatting and keeps the words', () => {
        expect(
            markdownPreview('Hello **big** _world_ [link](https://a.b)'),
        ).toBe('Hello big world link');
    });

    it('joins paragraphs and list items with a space', () => {
        expect(markdownPreview('one\n\ntwo\n\n- three\n- four')).toBe(
            'one two three four',
        );
    });

    it('hides spoilers and images', () => {
        expect(
            markdownPreview('a :spoiler[secret] b ![x](https://a.b/i.png)'),
        ).toBe('a [спойлер] b');
        expect(markdownPreview(':::spoiler\nhidden\n:::')).toBe('[спойлер]');
    });

    it('keeps mentions as typed', () => {
        expect(markdownPreview('hi @olex')).toBe('hi @olex');
    });
});
