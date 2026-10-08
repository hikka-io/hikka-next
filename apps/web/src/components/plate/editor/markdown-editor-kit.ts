import { TrailingBlockPlugin } from 'platejs';
import { ParagraphPlugin } from 'platejs/react';

import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { ContentSearchKit } from './plugins/content-search-kit';
import { EmojiKit } from './plugins/emoji-kit';
import { ExitBreakKit } from './plugins/exit-break-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-classic-kit';
import { createMarkdownKit } from './plugins/markdown-kit';
import { SpoilerKit } from './plugins/spoiler-kit';
import { StrikethroughKit } from './plugins/strikethrough-kit';
import { TextSubstitutionsKit } from './plugins/text-substitutions-kit';
import { UserSearchKit } from './plugins/user-search-kit';

export const MarkdownEditorKit = [
    // Elements
    ...BasicBlocksKit,
    ...LinkKit,
    ...SpoilerKit,

    // Marks
    ...BasicMarksKit,
    ...StrikethroughKit,

    // Editing
    ...EmojiKit,
    ...UserSearchKit,
    ...ContentSearchKit,
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    ...ExitBreakKit,
    ...TextSubstitutionsKit,

    // Block Style
    ...ListKit,

    // Parsers
    ...createMarkdownKit({ mentions: true }),
];
