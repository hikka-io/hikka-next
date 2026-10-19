import { KEYS, TrailingBlockPlugin } from 'platejs';
import { BlockPlaceholderPlugin, ParagraphPlugin } from 'platejs/react';

import { ARTICLE_BLOCK_PLACEHOLDER } from './plate-types';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { BlockSelectionKit } from './plugins/block-selection-kit';
import { ContentSearchKit } from './plugins/content-search-kit';
import { DndKit } from './plugins/dnd-kit';
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
    // Before anything else that overrides `selectAll`, as the plugin asks.
    ...BlockSelectionKit,
    ...EmojiKit,
    ...ContentSearchKit,
    ...UserSearchKit,
    ...SlashKit,
    ...DndKit,
    BlockPlaceholderPlugin.configure({
        options: {
            className:
                'before:pointer-events-none before:absolute before:text-muted-foreground/80 before:content-[attr(placeholder)]',
            placeholders: {
                [KEYS.p]: ARTICLE_BLOCK_PLACEHOLDER,
                [KEYS.h3]: 'Заголовок',
                [KEYS.h4]: 'Заголовок',
                [KEYS.h5]: 'Заголовок',
            },
        },
    }),
    TrailingBlockPlugin.configure({ options: { type: ParagraphPlugin.key } }),
    ...ExitBreakKit,
    ...TextSubstitutionsKit,

    // Block Style
    ...ListKit,

    // Parsers
    ...MarkdownKit,
];
