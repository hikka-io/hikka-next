import { describe, expect, it } from 'vitest';

import { serializeJsonLd } from './json-ld';

const payload = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '</script><img src=x onerror=alert(1)>',
    author: {
        '@type': 'Person',
        name: 'He said "hi" & \'bye\' \\ </SCRIPT >',
    },
    keywords: [
        'Атака титанів',
        '進撃の巨人',
        '🎌',
        'line\u2028sep',
        'para\u2029sep',
    ],
    nested: { deeper: [{ text: '<!-- hidden --> <b>bold</b>' }] },
    count: 12,
    flag: true,
    missing: null,
};

describe('serializeJsonLd', () => {
    it('round-trips to the same value', () => {
        expect(JSON.parse(serializeJsonLd(payload))).toEqual(payload);
    });

    it('emits no raw < so the data cannot close the script tag', () => {
        const serialized = serializeJsonLd(payload);

        expect(serialized).not.toContain('<');
        expect(serialized).toContain('\\u003c/script>');
    });

    it('neutralises html comment sequences', () => {
        const serialized = serializeJsonLd({ text: '<!-- a --> b <!--' });

        expect(serialized).not.toContain('<');
        expect(serialized).not.toContain('<!--');
        expect(serialized).toContain('\\u003c!--');
        expect(JSON.parse(serialized)).toEqual({ text: '<!-- a --> b <!--' });
    });

    it('escapes line and paragraph separators', () => {
        const serialized = serializeJsonLd({ text: 'a\u2028b\u2029c' });

        expect(serialized).not.toMatch(/[\u2028\u2029]/);
        expect(serialized).toBe('{"text":"a\\u2028b\\u2029c"}');
    });
});
