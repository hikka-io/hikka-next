import type { Tokens } from 'marked';
import { describe, expect, it } from 'vitest';

import { lexMarkdown } from './lexer';
import { asMention, isUserReference, userUrlTarget } from './mentions';

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';

const linkIn = (source: string) => {
    const [paragraph] = lexMarkdown(source) as { tokens: Tokens.Link[] }[];

    return paragraph.tokens[0];
};

describe('user links', () => {
    it('accepts the urls the picker writes', () => {
        expect(userUrlTarget('/u/olexh')).toBe('olexh');
        expect(userUrlTarget('https://hikka.io/u/olexh')).toBe('olexh');
        expect(userUrlTarget(`https://hikka.io/u/${REFERENCE}`)).toBe(
            REFERENCE,
        );
    });

    it('rejects urls that raw serialization would mangle', () => {
        expect(userUrlTarget('https://hikka.io/u/name)and(more')).toBeNull();
        expect(userUrlTarget('https://hikka.io/u/name with space')).toBeNull();
        expect(userUrlTarget('https://hikka.io/u/olexh/list')).toBeNull();
        expect(userUrlTarget('https://hikka.io/anime/naruto')).toBeNull();
    });

    it('tells a reference from a username', () => {
        expect(isUserReference(REFERENCE)).toBe(true);
        expect(isUserReference('olexh')).toBe(false);
    });
});

describe('mention links', () => {
    it('reads a reference link', () => {
        expect(
            asMention(linkIn(`[@olexh](https://hikka.io/u/${REFERENCE})`)),
        ).toEqual({ username: 'olexh', reference: REFERENCE });
    });

    it('reads a username link', () => {
        expect(asMention(linkIn('[@olexh](https://hikka.io/u/olexh)'))).toEqual(
            {
                username: 'olexh',
            },
        );
    });

    it('leaves ordinary and non-user links alone', () => {
        expect(
            asMention(linkIn('[olexh](https://hikka.io/u/olexh)')),
        ).toBeNull();
        expect(
            asMention(linkIn('[@olexh](https://hikka.io/anime/naruto)')),
        ).toBeNull();
    });
});
