import { MarkdownPlugin } from '@platejs/markdown';
import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { getSiteUrl } from '@/utils/url';

import { ArticleKit } from '../article-kit';
import { MarkdownEditorKit } from '../markdown-editor-kit';
import { USER_SEARCH_INPUT_KEY } from './trigger-keys';

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';
const SITE = getSiteUrl();

// The scan the backend runs over stored comment text to raise tag notifications.
const BACKEND_TAG_REGEX = /@([a-zA-Z0-9_]+)/g;

const makeEditor = (value: Value = [], plugins: any = MarkdownEditorKit) =>
    createPlateEditor({ plugins, value }) as any;

const serialize = (value: Value, plugins?: any) =>
    makeEditor(value, plugins).getApi(MarkdownPlugin).markdown.serialize();

const deserialize = (markdown: string, plugins?: any) =>
    makeEditor([], plugins)
        .getApi(MarkdownPlugin)
        .markdown.deserialize(markdown);

const userLink = (username: string, target: string) => ({
    type: 'a',
    url: `${SITE}/u/${target}`,
    children: [{ text: `@${username}` }],
});

const paragraph = (...children: any[]) => ({ type: 'p', children });

const linksOf = (value: Value): any[] =>
    value.flatMap((node: any) =>
        (node.children ?? []).filter((child: any) => child.type === 'a'),
    );

describe('mention serialization', () => {
    it('keeps the username visible and links by reference', () => {
        const markdown = serialize([
            paragraph({ text: 'дякую ' }, userLink('olexh', REFERENCE), {
                text: ' за пораду',
            }),
        ]);

        expect(markdown.trim()).toBe(
            `дякую [@olexh](${SITE}/u/${REFERENCE}) за пораду`,
        );
    });

    it('stays matchable by the backend tag scan', () => {
        const markdown = serialize([
            paragraph(
                { text: '' },
                userLink('olexh', REFERENCE),
                { text: ' та ' },
                userLink('second_user', REFERENCE),
            ),
        ]);

        expect(markdown).not.toContain('\\');
        expect(
            [...markdown.matchAll(BACKEND_TAG_REGEX)].map((m) => m[1]),
        ).toEqual(['olexh', 'second_user']);
    });

    it('leaves an ordinary link to the default escaping', () => {
        const markdown = serialize([
            paragraph({ text: '' }, {
                type: 'a',
                url: `${SITE}/anime/some_slug`,
                children: [{ text: 'Some_title' }],
            } as any),
        ]);

        expect(markdown.trim()).toBe(`[Some\\_title](${SITE}/anime/some_slug)`);
    });
});

describe('mention deserialization', () => {
    it('turns a legacy bare mention into a link by username', () => {
        const links = linksOf(deserialize('дякую @olexh за пораду'));

        expect(links).toHaveLength(1);
        expect(links[0].url).toBe(`${SITE}/u/olexh`);
        expect(links[0].children[0].text).toBe('@olexh');
    });

    it('leaves a plain link alone', () => {
        const links = linksOf(deserialize(`[hikka](${SITE}/anime/naruto)`));

        expect(links).toHaveLength(1);
        expect(links[0].url).toBe(`${SITE}/anime/naruto`);
    });
});

describe('mention round trip', () => {
    it('is stable for a picked mention', () => {
        const markdown = `дякую [@olexh](${SITE}/u/${REFERENCE}) за пораду`;

        expect(serialize(deserialize(markdown)).trim()).toBe(markdown);
    });

    it('upgrades a legacy bare mention to a link', () => {
        expect(serialize(deserialize('дякую @olexh'))).toContain(
            `[@olexh](${SITE}/u/olexh)`,
        );
    });

    it('does not backslash-escape an underscore username', () => {
        const markdown = `дякую [@second_user](${SITE}/u/${REFERENCE})`;

        expect(serialize(deserialize(markdown)).trim()).toBe(markdown);
    });
});

describe('article editor', () => {
    it('offers the same user picker', () => {
        const editor = createPlateEditor({
            plugins: ArticleKit,
            value: [{ type: 'p', children: [{ text: '' }] }],
        }) as any;

        expect(editor.getPlugin({ key: USER_SEARCH_INPUT_KEY })).toBeTruthy();
    });

    it('mints links rather than mention nodes the backend schema rejects', () => {
        const value = deserialize('дякую @olexh', ArticleKit);

        expect(
            value.flatMap((node: any) =>
                (node.children ?? []).filter(
                    (child: any) => child.type === 'mention',
                ),
            ),
        ).toHaveLength(0);
    });
});
