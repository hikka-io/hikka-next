import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { EmojiToolbarButton } from './emoji-toolbar-button';
import { FixedToolbarScroller } from './fixed-toolbar';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButtons, type ToolbarMark } from './mark-toolbar-buttons';
import { OverflowToolbarButton } from './overflow-toolbar-button';
import { SpoilerToolbarButton } from './spoiler-toolbar-button';
import { ToolbarGroup } from './toolbar';

const MARKDOWN_MARKS: ToolbarMark[] = [
    KEYS.bold,
    KEYS.italic,
    KEYS.strikethrough,
];

type Props = {
    className?: string;
};

export function FixedMarkdownToolbarButtons({ className }: Props) {
    const readOnly = useEditorReadOnly();

    return (
        <FixedToolbarScroller className={className}>
            {!readOnly && (
                <>
                    <MarkToolbarButtons marks={MARKDOWN_MARKS} />

                    <ToolbarGroup>
                        <SpoilerToolbarButton />
                        <LinkToolbarButton />
                        <EmojiToolbarButton />
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <UndoToolbarButton />
                        <RedoToolbarButton />
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <OverflowToolbarButton />
                    </ToolbarGroup>
                </>
            )}
        </FixedToolbarScroller>
    );
}
