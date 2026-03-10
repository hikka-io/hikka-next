'use client';

import { TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin, useEditorRef } from 'platejs/react';

import { AutoformatArticleKit } from './plugins/autoformat-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { EmojiKit } from './plugins/emoji-kit';
import { ExitBreakKit } from './plugins/exit-break-kit';
import { FixedArticleToolbarKit } from './plugins/fixed-toolbar-kit';
import { HeadingsKit } from './plugins/headings-kit';
import { ImageGroupKit } from './plugins/image-group-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-classic-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { SpoilerKit } from './plugins/spoiler-kit';
import { VideoKit } from './plugins/video-kit';

export const ArticleKit = [
    // Elements
    ...BasicBlocksKit,
    ...HeadingsKit,
    ...LinkKit,
    ...SpoilerKit,
    ...VideoKit,
    ...ImageGroupKit,

    // Marks
    ...BasicMarksKit,

    // Editing
    ...EmojiKit,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    ...ExitBreakKit,
    ...AutoformatArticleKit,

    // Block Style
    ...ListKit,

    // Parsers
    ...MarkdownKit,

    // UI
    ...FixedArticleToolbarKit,
];

export const useArticleEditor = () => useEditorRef();
