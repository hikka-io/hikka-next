import { useRef } from 'react';

import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import { EmojiToolbarButton } from './emoji-toolbar-button';
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
    const scrollRef = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(
        scrollRef,
        'horizontal',
    );

    return (
        <div
            ref={scrollRef}
            className={cn(
                'flex flex-1 overflow-x-scroll md:overflow-x-hidden',
                gradientClassName,
                className,
            )}
        >
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
        </div>
    );
}
