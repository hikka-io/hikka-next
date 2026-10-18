import { useEditorReadOnly } from 'platejs/react';

import { ARTICLE_MARKS } from '../editor/plate-types';
import { EmojiToolbarButton } from './emoji-toolbar-button';
import { FixedToolbarScroller } from './fixed-toolbar';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImageGroupToolbarButton } from './image-group-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButtons } from './mark-toolbar-buttons';
import {
    ContentSearchToolbarButton,
    UserSearchToolbarButton,
} from './search-toolbar-buttons';
import { SpoilerToolbarButton } from './spoiler-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { VideoToolbarButton } from './video-toolbar-button';

export function FixedArticleToolbarButtons() {
    const readOnly = useEditorReadOnly();

    return (
        <FixedToolbarScroller>
            {!readOnly && (
                <>
                    <ToolbarGroup>
                        <InsertToolbarButton />
                    </ToolbarGroup>

                    <MarkToolbarButtons marks={ARTICLE_MARKS} />

                    <ToolbarGroup>
                        <SpoilerToolbarButton />
                        <LinkToolbarButton />
                        <ContentSearchToolbarButton />
                        <UserSearchToolbarButton />
                        <EmojiToolbarButton />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <VideoToolbarButton />
                        <ImageGroupToolbarButton />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <UndoToolbarButton />
                        <RedoToolbarButton />
                    </ToolbarGroup>
                </>
            )}
        </FixedToolbarScroller>
    );
}
