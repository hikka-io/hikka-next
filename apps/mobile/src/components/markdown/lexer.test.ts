import type { Token } from 'marked';
import { describe, expect, it } from 'vitest';

import { lexMarkdown } from './lexer';
import { plainText } from './plain-text';

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';

const inline = (source: string): Token[] => {
    const [paragraph] = lexMarkdown(source) as (Token & { tokens: Token[] })[];

    return paragraph.tokens;
};

const types = (tokens: Token[]) => tokens.map((token) => token.type);

const visible = (tokens: Token[]) =>
    tokens.filter((token) => token.type !== 'space');

describe('block spoiler', () => {
    it('lexes a closed container into a spoiler directive', () => {
        const [directive] = visible(lexMarkdown(':::spoiler\nsecret\n:::'));

        expect(directive).toMatchObject({ type: 'directive', name: 'spoiler' });
        expect(plainText((directive as any).tokens)).toBe('secret');
    });

    it('keeps text after the closing fence outside', () => {
        const tokens = visible(lexMarkdown(':::spoiler\nsecret\n:::\n\nafter'));

        expect(types(tokens)).toEqual(['directive', 'paragraph']);
        expect(plainText((tokens[1] as any).tokens)).toBe('after');
    });

    it('runs an unclosed container to the end', () => {
        const [directive] = visible(lexMarkdown(':::spoiler\na\n\nb'));

        expect(
            types((directive as any).tokens).filter((t) => t === 'paragraph'),
        ).toHaveLength(2);
    });

    it('nests containers with more colons', () => {
        const [outer] = visible(
            lexMarkdown('::::spoiler\n:::spoiler\ninner\n:::\n::::'),
        );
        const [inner] = visible((outer as any).tokens);

        expect(inner).toMatchObject({ type: 'directive', name: 'spoiler' });
    });

    it('accepts a label and attributes on the opening line', () => {
        const [directive] = visible(
            lexMarkdown(':::spoiler[Title]{open}\nsecret\n:::'),
        );

        expect(directive).toMatchObject({ type: 'directive', name: 'spoiler' });
    });

    it('lexes the markdown inside the container', () => {
        const [directive] = visible(
            lexMarkdown(':::spoiler\n**bold** and\n\n- item\n:::'),
        );

        expect(types((directive as any).tokens)).toContain('list');
    });

    it('does not treat two colons as a container', () => {
        const [first] = visible(lexMarkdown('::spoiler\nx'));

        expect(first.type).toBe('paragraph');
    });
});

describe('inline spoiler', () => {
    it('lexes the labelled form inside the paragraph', () => {
        const tokens = inline('a :spoiler[hidden] b');

        expect(types(tokens)).toEqual(['text', 'spoiler', 'text']);
        expect(plainText((tokens[1] as any).tokens)).toBe('hidden');
    });

    it('lexes markdown in the label', () => {
        const [spoiler] = inline(':spoiler[**bold** [x](https://a.b)]');

        expect(types((spoiler as any).tokens)).toEqual([
            'strong',
            'text',
            'link',
        ]);
    });

    it('balances brackets in the label', () => {
        const [spoiler] = inline(':spoiler[a [b] c] tail');

        expect(plainText((spoiler as any).tokens)).toBe('a [b] c');
    });

    it('consumes trailing attributes', () => {
        const tokens = inline(':spoiler[x]{a=b} tail');

        expect(plainText(tokens)).toBe('x tail');
    });

    it.each([
        ['Re:Zero is great', 'Re:Zero is great'],
        ['plain :spoiler b', 'plain :spoiler b'],
        ['see :note[kept] ok', 'see :note[kept] ok'],
        ['::note[leaf]', '::note[leaf]'],
        ['no label :spoiler[] here', 'no label :spoiler[] here'],
        ['unclosed :spoiler[x', 'unclosed :spoiler[x'],
        ['word:spoiler[x]', 'word:spoiler[x]'],
    ])('keeps %j as text', (source, expected) => {
        const tokens = inline(source);

        expect(tokens.some((token) => token.type === 'spoiler')).toBe(false);
        expect(plainText(tokens)).toBe(expected);
    });
});

describe('strikethrough', () => {
    it('lexes double tildes', () => {
        const tokens = inline('a ~~struck~~ b');

        expect(types(tokens)).toEqual(['text', 'strike', 'text']);
        expect(plainText((tokens[1] as any).tokens)).toBe('struck');
    });

    it('leaves a single tilde as text', () => {
        const tokens = inline('~5 серій~');

        expect(types(tokens)).not.toContain('strike');
        expect(plainText(tokens)).toBe('~5 серій~');
    });

    it('does not strike through padded or tripled tildes', () => {
        expect(types(inline('~~ a ~~'))).not.toContain('strike');
        expect(types(inline('~~~a~~~'))).not.toContain('strike');
    });
});

describe('web dialect', () => {
    it('keeps backticks as text', () => {
        expect(plainText(inline('use `code` here'))).toBe('use `code` here');
    });

    it('keeps a fenced block as text', () => {
        const tokens = visible(lexMarkdown('```js\nlet a\n```'));

        expect(types(tokens)).toEqual(['paragraph']);
        expect(plainText((tokens[0] as any).tokens)).toContain('```js');
    });

    it('keeps bare urls as text', () => {
        const tokens = inline('see https://hikka.io/anime/x now');

        expect(types(tokens)).not.toContain('link');
    });

    it('keeps table syntax as text', () => {
        const tokens = visible(lexMarkdown('| a | b |\n| - | - |\n| 1 | 2 |'));

        expect(types(tokens)).toEqual(['paragraph']);
    });

    it('decodes entities and collapses soft breaks', () => {
        expect(plainText(inline('a &amp; b &quot;c&quot;\nnext &copy;'))).toBe(
            'a & b "c" next ©',
        );
    });

    it('turns a hard break into a break token', () => {
        expect(types(inline('one  \ntwo'))).toContain('br');
    });

    it('keeps list structure', () => {
        const [list] = visible(lexMarkdown('1. a\n2. b'));

        expect(list).toMatchObject({ type: 'list', ordered: true });
    });
});

describe('mentions', () => {
    it('lexes a bare mention in running text', () => {
        const tokens = inline('дякую @olexh за пораду');
        const mention = tokens.find((token) => token.type === 'mention');

        expect(mention).toMatchObject({ username: 'olexh' });
    });

    it('lexes a mention at the start of the paragraph', () => {
        expect(types(inline('@olexh hi'))).toEqual(['mention', 'text']);
    });

    it('does not read a mention inside a user link label', () => {
        const [link] = inline(`[@olexh](https://hikka.io/u/${REFERENCE})`);

        expect(types((link as any).tokens)).toEqual(['text']);
    });

    it.each([40, 41, 64])('links a %i character name whole', (length) => {
        const name = `a${'b'.repeat(length - 2)}9`;
        const mention = inline(`привіт @${name} як`).find(
            (token) => token.type === 'mention',
        );

        expect(mention).toMatchObject({ username: name });
    });

    it.each([
        ['a name longer than 64 characters', `привіт @a${'b'.repeat(64)}9 як`],
        ['a name shorter than the minimum', 'привіт @olex'],
        ['a hyphen inside', 'привіт @hello-world'],
        ['a trailing hyphen', 'привіт @olexh- як'],
        ['a leading digit', 'привіт @1olexh'],
        ['only underscores', 'привіт @_____'],
        ['an email address', 'пишіть на olexh@gmail.com'],
    ])('does not link %s', (_, source) => {
        expect(types(inline(source))).not.toContain('mention');
    });

    it('keeps the typed case', () => {
        expect(
            inline('дякую @OlexH_2').find((t) => t.type === 'mention'),
        ).toMatchObject({
            username: 'OlexH_2',
        });
    });
});
