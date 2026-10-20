import type { Token, Tokens } from 'marked';
import { describe, expect, it } from 'vitest';

import { lexMarkdown } from './lexer';
import { plainText } from './plain-text';

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';

const inline = (source: string): Token[] => {
    const [paragraph] = lexMarkdown(source) as (Token & { tokens: Token[] })[];

    return paragraph.tokens;
};

const children = (token: Token): Token[] =>
    (token as Token & { tokens: Token[] }).tokens;

const flatten = (token: Token): Token[] =>
    'tokens' in token && token.tokens ? token.tokens : [token];

const types = (tokens: Token[]) => tokens.map((token) => token.type);

const visible = (tokens: Token[]) =>
    tokens.filter((token) => token.type !== 'space');

describe('block spoiler', () => {
    it('lexes a closed container into a spoiler directive', () => {
        const [directive] = visible(lexMarkdown(':::spoiler\nsecret\n:::'));

        expect(directive).toMatchObject({ type: 'directive', name: 'spoiler' });
        expect(plainText(children(directive))).toBe('secret');
    });

    it('keeps text after the closing fence outside', () => {
        const tokens = visible(lexMarkdown(':::spoiler\nsecret\n:::\n\nafter'));

        expect(types(tokens)).toEqual(['directive', 'paragraph']);
        expect(plainText(children(tokens[1]))).toBe('after');
    });

    it('runs an unclosed container to the end', () => {
        const [directive] = visible(lexMarkdown(':::spoiler\na\n\nb'));

        expect(
            types(children(directive)).filter((t) => t === 'paragraph'),
        ).toHaveLength(2);
    });

    it('nests containers with more colons', () => {
        const [outer] = visible(
            lexMarkdown('::::spoiler\n:::spoiler\ninner\n:::\n::::'),
        );
        const [inner] = visible(children(outer));

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

        expect(types(children(directive))).toContain('list');
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
        expect(plainText(children(tokens[1]))).toBe('hidden');
    });

    it('lexes markdown in the label', () => {
        const [spoiler] = inline(':spoiler[**bold** [x](https://a.b)]');

        expect(types(children(spoiler))).toEqual(['strong', 'text', 'link']);
    });

    it('balances brackets in the label', () => {
        const [spoiler] = inline(':spoiler[a [b] c] tail');

        expect(plainText(children(spoiler))).toBe('a [b] c');
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
        ['a::spoiler[x]', 'a::spoiler[x]'],
    ])('keeps %j as text', (source, expected) => {
        const tokens = inline(source);

        expect(tokens.some((token) => token.type === 'spoiler')).toBe(false);
        expect(plainText(tokens)).toBe(expected);
    });
});

describe('spoiler boundary', () => {
    it('hides a spoiler directly after a word or digit, like the web', () => {
        expect(types(inline('Серія 12:spoiler[Рем помирає]'))).toContain(
            'spoiler',
        );
        expect(types(inline('word:spoiler[x]'))).toContain('spoiler');
    });

    it('rejects a spoiler right after a colon', () => {
        expect(types(inline('a::spoiler[x]'))).not.toContain('spoiler');
    });
});

describe('pathological input', () => {
    const fast = (source: string) => {
        const started = performance.now();

        lexMarkdown(source);

        return performance.now() - started;
    };

    it('lexes a padded container opener quickly', () => {
        expect(fast(`:::spoiler${' '.repeat(2000)}x`)).toBeLessThan(50);
        expect(fast(`:::spoiler[a]${' \t'.repeat(1000)}x`)).toBeLessThan(50);
    });

    it('lexes repeated openers and tildes quickly', () => {
        expect(fast(':::spoiler\n'.repeat(180))).toBeLessThan(200);
        expect(fast('~~a '.repeat(500))).toBeLessThan(200);
        expect(fast(':spoiler['.repeat(250))).toBeLessThan(200);
    });
});

describe('strikethrough', () => {
    it('lexes double tildes', () => {
        const tokens = inline('a ~~struck~~ b');

        expect(types(tokens)).toEqual(['text', 'strike', 'text']);
        expect(plainText(children(tokens[1]))).toBe('struck');
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
        expect(plainText(children(tokens[0]))).toContain('```js');
    });

    it('keeps bare urls as text', () => {
        const tokens = inline('see https://hikka.io/anime/x now');

        expect(types(tokens)).not.toContain('link');
    });

    it.each([
        ['an inline tag', 'a <b>bold</b> b', 'a <b>bold</b> b'],
        ['a block tag', '<div>box</div>', '<div>box</div>'],
        [
            'a link tag',
            '<a href="https://x.y">x</a> @olexh',
            '<a href="https://x.y">x</a> @olexh',
        ],
        ['a comment', 'a <!-- note --> b', 'a <!-- note --> b'],
    ])('shows %s as literal text', (_, source, expected) => {
        const tokens = visible(lexMarkdown(source));
        const flat = plainText(tokens.flatMap(flatten));

        expect(flat).toBe(expected);
    });

    it('still reads a mention after a literal tag', () => {
        expect(types(inline('<a href="x"> @olexh'))).toContain('mention');
    });

    it('keeps task list markers literal', () => {
        const [list] = visible(
            lexMarkdown('- [x] done\n- [ ] todo'),
        ) as Tokens.List[];

        expect(list.items.map((item) => item.task)).toEqual([false, false]);
        expect(plainText(list.items[0].tokens.flatMap(flatten))).toBe(
            '[x] done',
        );
        expect(plainText(list.items[1].tokens.flatMap(flatten))).toBe(
            '[ ] todo',
        );
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

        expect(types(children(link))).toEqual(['text']);
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
