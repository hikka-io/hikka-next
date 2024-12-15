'use client';

import { BasicElementsPlugin } from '@udecode/plate-basic-elements/react';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { ParagraphPlugin } from '@udecode/plate-common/react';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import {
    BulletedListPlugin,
    ListPlugin,
    NumberedListPlugin,
} from '@udecode/plate-list/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { autoformatListPlugin } from './plugins/autoformat-list-plugin';
import { FixedToolbarPlugin } from './plugins/fixed-toolbar-plugin';
import { linkPlugin } from './plugins/link-plugin';
import { MarkdownPlugin } from './plugins/markdown-plugin/markdown-plugin';
import { SpoilerPlugin } from './plugins/spoiler-plugin/spoiler-plugin';

export const editorPlugins = [
    BasicElementsPlugin,
    BasicMarksPlugin,
    linkPlugin,
    ListPlugin,
    NumberedListPlugin,
    BulletedListPlugin,
    autoformatListPlugin,
    SpoilerPlugin,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    MarkdownPlugin,
    FixedToolbarPlugin,
    EmojiPlugin,
    SoftBreakPlugin.configure({
        options: {
            rules: [
                { hotkey: 'shift+enter' },
                {
                    hotkey: 'enter',
                    query: {
                        allow: [BlockquotePlugin.key, SpoilerPlugin.key],
                    },
                },
            ],
        },
    }),
    ExitBreakPlugin.configure({
        options: {
            rules: [
                {
                    hotkey: 'mod+enter',
                },
                {
                    hotkey: 'mod+shift+enter',
                    before: true,
                },
            ],
        },
    }),
];
