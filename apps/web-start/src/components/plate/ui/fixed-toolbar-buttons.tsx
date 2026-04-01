'use client';

import { BoldIcon, ItalicIcon } from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';
import { useRef } from 'react';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import { EmojiToolbarButton } from './emoji-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImageGroupToolbarButton } from './image-group-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { VideoToolbarButton } from './video-toolbar-button';

interface Props {
    className?: string;
}

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
                    <ToolbarGroup>
                        <InsertToolbarButton type="comment" />
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <MarkToolbarButton
                            nodeType={KEYS.bold}
                            tooltip="Жирний (⌘+B)"
                        >
                            <BoldIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={KEYS.italic}
                            tooltip="Курсив (⌘+I)"
                        >
                            <ItalicIcon />
                        </MarkToolbarButton>
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <LinkToolbarButton />
                        <EmojiToolbarButton />
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

export function FixedArticleToolbarButtons() {
    const readOnly = useEditorReadOnly();

    return (
        <div className="flex w-full">
            {!readOnly && (
                <>
                    <ToolbarGroup>
                        <InsertToolbarButton type="article" />
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <MarkToolbarButton
                            nodeType={KEYS.bold}
                            tooltip="Жирний (⌘+B)"
                        >
                            <BoldIcon />
                        </MarkToolbarButton>

                        <MarkToolbarButton
                            nodeType={KEYS.italic}
                            tooltip="Курсив (⌘+I)"
                        >
                            <ItalicIcon />
                        </MarkToolbarButton>
                    </ToolbarGroup>

                    <ToolbarGroup>
                        <LinkToolbarButton />
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
