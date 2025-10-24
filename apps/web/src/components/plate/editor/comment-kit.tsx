'use client';

import { TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin, useEditorRef } from 'platejs/react';

import { AutoformatCommentKit } from './plugins/autoformat-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { EmojiKit } from './plugins/emoji-kit';
import { ExitBreakKit } from './plugins/exit-break-kit';
import { FixedCommentToolbarKit } from './plugins/fixed-toolbar-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-classic-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { SpoilerKit } from './plugins/spoiler-kit';

export const CommentKit = [
    // Elements
    ...BasicBlocksKit,
    ...LinkKit,
    ...SpoilerKit,

    // Marks
    ...BasicMarksKit,

    // Editing
    ...EmojiKit,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    ...ExitBreakKit,
    ...AutoformatCommentKit,

    // Block Style
    ...ListKit,

    // Parsers
    ...MarkdownKit,

    // UI
    ...FixedCommentToolbarKit,
];

export const useCommentEditor = () => useEditorRef();
