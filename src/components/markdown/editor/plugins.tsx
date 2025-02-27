'use client';

import { BasicElementsPlugin } from '@udecode/plate-basic-elements/react';
import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { isSelectionAtBlockStart } from '@udecode/plate-common';
import { ParagraphPlugin } from '@udecode/plate-common/react';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import {
    BulletedListPlugin,
    ListPlugin,
    NumberedListPlugin,
} from '@udecode/plate-list/react';
import { ResetNodePlugin } from '@udecode/plate-reset-node/react';
import { DeletePlugin } from '@udecode/plate-select';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { autoformatListPlugin } from './plugins/autoformat-list-plugin';
import { DiffPlugin } from './plugins/diff-plugin';
import { ImageGroupPlugin } from './plugins/image-group-plugin/image-group-plugin';
import { linkPlugin } from './plugins/link-plugin';
import { MarkdownPlugin } from './plugins/markdown-plugin/markdown-plugin';
import { SpoilerPlugin } from './plugins/spoiler-plugin/spoiler-plugin';

const resetBlockTypesCommonRule = {
    types: [BlockquotePlugin.key],
    defaultType: ParagraphPlugin.key,
};

export const basicPlugins = [
    DiffPlugin,
    BasicElementsPlugin,
    BoldPlugin,
    ItalicPlugin,
    linkPlugin,
    ListPlugin,
    NumberedListPlugin,
    BulletedListPlugin,
    autoformatListPlugin,
    SpoilerPlugin,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    MarkdownPlugin,
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
    ResetNodePlugin.configure({
        options: {
            rules: [
                {
                    ...resetBlockTypesCommonRule,
                    hotkey: 'Backspace',
                    predicate: isSelectionAtBlockStart,
                },
            ],
        },
    }),
    DeletePlugin.configure({
        options: {
            query: {
                allow: ['p', 'blockquote'],
            },
        },
    }),
];

export const articlePlugins = [...basicPlugins, ImageGroupPlugin];
