import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';

import remarkMentions from './remark-mentions';

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';

const paragraph = (...children: any[]): Root => ({
    type: 'root',
    children: [{ type: 'paragraph', children }],
});

const link = (url: string, label: string) => ({
    type: 'link',
    url,
    children: [{ type: 'text', value: label }],
});

const run = (tree: Root) => {
    remarkMentions()(tree);

    return (tree.children[0] as any).children;
};

describe('remark mentions', () => {
    it('leaves the label of a user link as plain text', () => {
        const [node] = run(
            paragraph(link(`https://hikka.io/u/${REFERENCE}`, '@olexh')),
        );

        expect(node.children).toEqual([{ type: 'text', value: '@olexh' }]);
    });

    it('still turns a bare mention in running text into one', () => {
        const nodes = run(
            paragraph({ type: 'text', value: 'дякую @olexh за пораду' }),
        );

        const mention = nodes.find(
            (node: any) => node.data?.hName === 'mention',
        );

        expect(mention).toBeTruthy();
        expect(mention.data.hProperties.username).toBe('olexh');
    });
});

type ResultNode = {
    value?: string;
    url?: string;
    children?: { value: string }[];
    data?: { hName?: string; hProperties?: { username: string } };
};

const nodesIn = (value: string): ResultNode[] =>
    run(paragraph({ type: 'text', value }));

const mentionsIn = (value: string) =>
    nodesIn(value)
        .filter((node) => node.data?.hName === 'mention')
        .map((node) => ({
            username: node.data?.hProperties?.username,
            label: node.children?.[0].value,
        }));

const usernameOf = (length: number) => `a${'b'.repeat(length - 2)}9`;

describe('bare mentions follow the username rule', () => {
    it.each([40, 41, 64])('links a %i character name whole', (length) => {
        const name = usernameOf(length);

        expect(mentionsIn(`привіт @${name} як справи`)).toEqual([
            { username: name, label: `@${name}` },
        ]);
    });

    it('does not link a name longer than 64 characters, not even in part', () => {
        expect(mentionsIn(`привіт @${usernameOf(65)} як справи`)).toEqual([]);
    });

    it('links the shortest valid name', () => {
        expect(mentionsIn('@olexh')).toEqual([
            { username: 'olexh', label: '@olexh' },
        ]);
    });

    it('does not link a name shorter than the minimum', () => {
        expect(mentionsIn('привіт @olex')).toEqual([]);
    });

    it.each([
        ['a hyphen inside', 'привіт @hello-world'],
        ['a trailing hyphen', 'привіт @olexh- як'],
        ['a leading digit', 'привіт @1olexh'],
        ['only underscores', 'привіт @_____'],
        ['a leading underscore', 'привіт @_olexh'],
    ])('does not link a name with %s', (_, text) => {
        expect(mentionsIn(text)).toEqual([]);
    });

    it('links a name that starts with a letter followed by underscores', () => {
        expect(mentionsIn('@a____ та @olexh_')).toEqual([
            { username: 'a____', label: '@a____' },
            { username: 'olexh_', label: '@olexh_' },
        ]);
    });

    it('matches case-insensitively and keeps the typed case', () => {
        expect(mentionsIn('дякую @OlexH_2')).toEqual([
            { username: 'OlexH_2', label: '@OlexH_2' },
        ]);
    });

    it.each([
        ['a@b.com'],
        ['пишіть на olexh@gmail.com'],
        ['olexh@gmail'],
    ])('does not link the address in %j', (text) => {
        expect(mentionsIn(text)).toEqual([]);
    });

    it.each([
        ['at the start of the text', '@olexh привіт'],
        ['after a space', 'привіт @olexh'],
        ['after a tab', 'привіт\t@olexh'],
        ['after a line break', 'привіт\n@olexh'],
    ])('links a mention %s', (_, text) => {
        expect(mentionsIn(text)).toEqual([
            { username: 'olexh', label: '@olexh' },
        ]);
    });

    it.each([
        ['an opening bracket', '(@olexh)'],
        ['a word character', 'hi@olexh'],
        ['a quote', '"@olexh"'],
    ])('does not link a mention right after %s', (_, text) => {
        expect(mentionsIn(text)).toEqual([]);
    });

    it.each([
        [',', '@olexh, дякую'],
        ['.', 'дякую @olexh.'],
        ['!', 'дякую @olexh!'],
        [')', 'дякую (так, @olexh)'],
        ['a Cyrillic letter', 'дякую @olexhу'],
    ])('ends a mention at %j', (_, text) => {
        expect(mentionsIn(text)).toEqual([
            { username: 'olexh', label: '@olexh' },
        ]);
    });

    it('keeps the text around a mention', () => {
        const nodes = nodesIn('дякую @olexh за пораду');

        expect(nodes.map((node) => node.value ?? node.url)).toEqual([
            'дякую',
            ' ',
            '/olexh',
            ' за пораду',
        ]);
    });

    it('links every valid mention in one text', () => {
        expect(
            mentionsIn('@olexh і @second_user, але не @1bad').map(
                ({ username }) => username,
            ),
        ).toEqual(['olexh', 'second_user']);
    });
});

describe('user links as mentions', () => {
    it('renders a picked mention as a mention', () => {
        const [node] = run(
            paragraph(link(`https://hikka.io/u/${REFERENCE}`, '@olexh')),
        );

        expect(node.data.hName).toBe('mention');
        expect(node.data.hProperties).toEqual({
            username: 'olexh',
            reference: REFERENCE,
        });
    });

    it('renders an upgraded bare mention by username', () => {
        const [node] = run(paragraph(link('/u/olexh', '@olexh')));

        expect(node.data.hName).toBe('mention');
        expect(node.data.hProperties).toEqual({ username: 'olexh' });
    });

    it('leaves an ordinary profile link alone', () => {
        const [node] = run(paragraph(link('/u/olexh', 'його профіль')));

        expect(node.data?.hName).toBeUndefined();
    });

    it('leaves a non-user link alone', () => {
        const [node] = run(paragraph(link('/anime/naruto', '@olexh')));

        expect(node.data?.hName).toBeUndefined();
    });
});
