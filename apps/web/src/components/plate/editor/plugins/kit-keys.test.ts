import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { createSlateEditor } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('platejs/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('platejs/react')>();

    return { ...actual, createPlateEditor: vi.fn(actual.createPlateEditor) };
});

import { ArticleKit } from '../article-kit';
import { DiffViewer } from '../diff-viewer';
import { MarkdownEditorKit } from '../markdown-editor-kit';
import { StaticKit } from '../static-kit';
import { createMarkdownKit, MarkdownKit } from './markdown-kit';

type KitPlugin = { key: string; plugins?: KitPlugin[] };

type ResolvedPlugin = {
    key: string;
    node: { component?: { displayName?: string; name?: string } };
};

type ResolvedEditor = { meta: { pluginList: unknown[] } };

type EditorPlugins = NonNullable<
    NonNullable<Parameters<typeof createPlateEditor>[0]>['plugins']
>;

const LIST_KEYS = [
    'listClassic',
    'listClassic>ul',
    'listClassic>ol',
    'listClassic>taskList',
    'listClassic>li',
    'listClassic>lic',
    'li',
    'lic',
    'ul',
    'ol',
    'li',
];

const EDITOR_LIST_KEYS = [
    'listClassic',
    'listClassic>ul',
    'listClassic>taskList',
    'listClassic>ol',
    'listClassic>li',
    'listClassic>lic',
    'li',
    'lic',
    'ul',
    'ol',
    'li',
];

const keysOf = (kit: readonly KitPlugin[]): string[] =>
    kit.flatMap((plugin) => [
        plugin.key,
        ...keysOf(plugin.plugins ?? []).map((key) => `${plugin.key}>${key}`),
    ]);

const componentsOf = (editor: ResolvedEditor): string[] =>
    (editor.meta.pluginList as ResolvedPlugin[])
        .filter((plugin) => plugin.node.component)
        .map(
            ({ key, node: { component } }) =>
                `${key}:${component?.displayName ?? component?.name}`,
        );

const diffViewerKit = (): EditorPlugins => {
    vi.mocked(createPlateEditor).mockClear();
    renderToString(createElement(DiffViewer, { current: 'a', previous: 'b' }));

    return vi.mocked(createPlateEditor).mock.calls[0][0]?.plugins ?? [];
};

describe('kit plugin keys', () => {
    it('keeps the markdown editor kit order', () => {
        expect(keysOf(MarkdownEditorKit as KitPlugin[])).toEqual([
            'p',
            'blockquote',
            'a',
            'spoiler',
            'spoiler_inline',
            'bold',
            'italic',
            'strikethrough',
            'emoji',
            'emoji>emoji_input',
            'emoji_input',
            'user_search',
            'user_search>user_search_input',
            'user_search_input',
            'content_search',
            'content_search>content_search_input',
            'content_search_input',
            'trailingBlock',
            'exitBreak',
            'text_substitutions',
            ...EDITOR_LIST_KEYS,
            'markdown',
        ]);
    });

    it('keeps the article kit order', () => {
        expect(keysOf(ArticleKit as KitPlugin[])).toEqual([
            'p',
            'blockquote',
            'h3',
            'h4',
            'h5',
            'a',
            'spoiler',
            'spoiler_inline',
            'video',
            'image',
            'image_placeholder',
            'image_group',
            'image_group>image',
            'image_group>image_placeholder',
            'bold',
            'italic',
            'emoji',
            'emoji>emoji_input',
            'emoji_input',
            'content_search',
            'content_search>content_search_input',
            'content_search_input',
            'user_search',
            'user_search>user_search_input',
            'user_search_input',
            'trailingBlock',
            'exitBreak',
            'text_substitutions',
            ...EDITOR_LIST_KEYS,
            'markdown',
            'fixed-article-toolbar',
        ]);
    });

    it('keeps the static kit order', () => {
        expect(keysOf(StaticKit as KitPlugin[])).toEqual([
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'blockquote',
            'a',
            'spoiler',
            'spoiler_inline',
            'video',
            'image',
            'image_group',
            'image_group>image',
            'bold',
            'italic',
            'strikethrough',
            ...LIST_KEYS,
        ]);
    });

    it('keeps the diff viewer kit order', () => {
        expect(keysOf(diffViewerKit() as KitPlugin[])).toEqual([
            'p',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'blockquote',
            'a',
            'spoiler',
            'spoiler_inline',
            'bold',
            'italic',
            'strikethrough',
            ...LIST_KEYS,
            'markdown',
            'diff',
        ]);
    });

    it('keeps one markdown plugin with and without mentions', () => {
        expect(keysOf(MarkdownKit as KitPlugin[])).toEqual(['markdown']);
        expect(
            keysOf(createMarkdownKit({ mentions: true }) as KitPlugin[]),
        ).toEqual(['markdown']);
    });
});

describe('kit node components', () => {
    it('renders the markdown editor nodes', () => {
        const editor = createPlateEditor({ plugins: MarkdownEditorKit });

        expect(componentsOf(editor as ResolvedEditor)).toEqual([
            'p:ParagraphElement',
            'blockquote:BlockquoteElement',
            'a:LinkElement',
            'spoiler:SpoilerElement',
            'spoiler_inline:SpoilerInlineElement',
            'emoji_input:EmojiInputElement',
            'user_search_input:UserSearchInputElement',
            'content_search_input:ContentSearchInputElement',
            'ul:BulletedListElement',
            'ol:NumberedListElement',
            'li:ListItemElement',
        ]);
    });

    it('renders the article editor nodes', () => {
        const editor = createPlateEditor({ plugins: ArticleKit });

        expect(componentsOf(editor as ResolvedEditor)).toEqual([
            'p:ParagraphElement',
            'blockquote:BlockquoteElement',
            'h3:H3Element',
            'h4:H4Element',
            'h5:H5Element',
            'a:LinkElement',
            'spoiler:SpoilerElement',
            'spoiler_inline:SpoilerInlineElement',
            'video:VideoElement',
            'image:ImageElement',
            'image_placeholder:ImagePlaceholderElement',
            'image_group:ImageGroupElement',
            'emoji_input:EmojiInputElement',
            'content_search_input:ContentSearchInputElement',
            'user_search_input:UserSearchInputElement',
            'ul:BulletedListElement',
            'ol:NumberedListElement',
            'li:ListItemElement',
        ]);
    });

    it('renders the static viewer nodes', () => {
        const editor = createSlateEditor({ nodeId: false, plugins: StaticKit });

        expect(componentsOf(editor as ResolvedEditor)).toEqual([
            'p:ParagraphElementStatic',
            'h1:H1ElementStatic',
            'h2:H2ElementStatic',
            'h3:H3ElementStatic',
            'h4:H4ElementStatic',
            'h5:H5ElementStatic',
            'blockquote:BlockquoteElementStatic',
            'a:LinkElementStatic',
            'spoiler:SpoilerElementStatic',
            'spoiler_inline:SpoilerInlineElementStatic',
            'video:VideoElementStatic',
            'image:ImageElementStatic',
            'image_group:ImageGroupElementStatic',
            'ul:BulletedListElementStatic',
            'ol:NumberedListElementStatic',
            'li:ListItemElementStatic',
        ]);
    });

    it('renders the diff viewer nodes', () => {
        const editor = createPlateEditor({
            nodeId: false,
            plugins: diffViewerKit(),
        });

        expect(componentsOf(editor as ResolvedEditor)).toEqual([
            'p:ParagraphElementStatic',
            'h1:H1ElementStatic',
            'h2:H2ElementStatic',
            'h3:H3ElementStatic',
            'h4:H4ElementStatic',
            'h5:H5ElementStatic',
            'blockquote:BlockquoteElementStatic',
            'a:LinkElementStatic',
            'spoiler:SpoilerElementStatic',
            'spoiler_inline:SpoilerInlineElementStatic',
            'ul:BulletedListElementStatic',
            'ol:NumberedListElementStatic',
            'li:ListItemElementStatic',
            'diff:DiffLeaf',
        ]);
    });
});
