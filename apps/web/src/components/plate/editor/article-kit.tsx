import { TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin } from 'platejs/react';

import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { BlockInsertKit } from './plugins/block-insert-kit';
import { ContentSearchKit } from './plugins/content-search-kit';
import { EmojiKit } from './plugins/emoji-kit';
import { ExitBreakKit } from './plugins/exit-break-kit';
import { HeadingsKit } from './plugins/headings-kit';
import { ImageGroupKit } from './plugins/image-group-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-classic-kit';
import { MarkdownKit } from './plugins/markdown-kit';
import { SlashKit } from './plugins/slash-kit';
import { SpoilerKit } from './plugins/spoiler-kit';
import { TextSubstitutionsKit } from './plugins/text-substitutions-kit';
import { UserSearchKit } from './plugins/user-search-kit';
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
    ...ContentSearchKit,
    ...UserSearchKit,
    ...SlashKit,
    ...BlockInsertKit,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    ...ExitBreakKit,
    ...TextSubstitutionsKit,

    // Block Style
    ...ListKit,

    // Parsers
    ...MarkdownKit,
];
