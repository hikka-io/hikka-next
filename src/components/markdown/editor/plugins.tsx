'use client';

import { BoldPlugin, ItalicPlugin } from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { ExitBreakPlugin, SoftBreakPlugin } from '@udecode/plate-break/react';
import { isSelectionAtBlockStart } from '@udecode/plate-common';
import { ParagraphPlugin } from '@udecode/plate-common/react';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import { HEADING_LEVELS } from '@udecode/plate-heading';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import {
    BulletedListPlugin,
    ListPlugin,
    NumberedListPlugin,
} from '@udecode/plate-list/react';
import { ResetNodePlugin } from '@udecode/plate-reset-node/react';
import { DeletePlugin } from '@udecode/plate-select';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';

import uploadImage from '@/services/api/upload/uploadImage';

import { autoformatListPlugin } from './plugins/autoformat-list-plugin';
import { DiffPlugin } from './plugins/diff-plugin';
import { ImageGroupPlugin } from './plugins/image-group-plugin/image-group-plugin';
import { linkPlugin } from './plugins/link-plugin';
import { MarkdownPlugin } from './plugins/markdown-plugin/markdown-plugin';
import { SpoilerPlugin } from './plugins/spoiler-plugin/spoiler-plugin';

const resetBlockTypesCommonRule = {
    types: [...HEADING_LEVELS, BlockquotePlugin.key],
    defaultType: ParagraphPlugin.key,
};

export const basicPlugins = [
    DiffPlugin,
    BlockquotePlugin,
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
                {
                    hotkey: 'enter',
                    level: 1,
                    query: {
                        allow: HEADING_LEVELS,
                        end: true,
                        start: true,
                    },
                    relative: true,
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

export const articlePlugins = [
    ...basicPlugins,
    HeadingPlugin.configure({
        options: {
            levels: [3, 4, 5],
        },
    }),
    ImageGroupPlugin.extend({
        options: {
            uploadImage: (file) =>
                uploadImage({ params: { file, upload_type: 'attachment' } }),
        },
    }),
];
