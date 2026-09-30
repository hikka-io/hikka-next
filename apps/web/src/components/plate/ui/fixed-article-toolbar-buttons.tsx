import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { EmojiToolbarButton } from './emoji-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImageGroupToolbarButton } from './image-group-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButtons, type ToolbarMark } from './mark-toolbar-buttons';
import {
    ContentSearchToolbarButton,
    UserSearchToolbarButton,
} from './search-toolbar-buttons';
import { SpoilerToolbarButton } from './spoiler-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { VideoToolbarButton } from './video-toolbar-button';

const ARTICLE_MARKS: ToolbarMark[] = [KEYS.bold, KEYS.italic];

export function FixedArticleToolbarButtons() {
    const readOnly = useEditorReadOnly();

    return (
        <div className="flex w-full">
            {!readOnly && (
                <>
                    <ToolbarGroup>
                        <InsertToolbarButton type="article" />
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
        </div>
    );
}
