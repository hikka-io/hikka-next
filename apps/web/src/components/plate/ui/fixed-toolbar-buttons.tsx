import { useRef } from 'react';

import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorReadOnly } from 'platejs/react';

import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { cn } from '@/utils/cn';

import { EmojiToolbarButton } from './emoji-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImageGroupToolbarButton } from './image-group-toolbar-button';
import { InsertToolbarButton } from './insert-toolbar-button';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { OverflowToolbarButton } from './overflow-toolbar-button';
import {
    ContentSearchToolbarButton,
    UserSearchToolbarButton,
} from './search-toolbar-buttons';
import { SpoilerToolbarButton } from './spoiler-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { VideoToolbarButton } from './video-toolbar-button';

const MARKS = {
    [KEYS.bold]: { icon: BoldIcon, tooltip: 'Жирний (⌘+B)' },
    [KEYS.italic]: { icon: ItalicIcon, tooltip: 'Курсив (⌘+I)' },
    [KEYS.strikethrough]: { icon: StrikethroughIcon, tooltip: 'Закреслений' },
};

type Mark = keyof typeof MARKS;

const ARTICLE_MARKS: Mark[] = [KEYS.bold, KEYS.italic];
const MARKDOWN_MARKS: Mark[] = [...ARTICLE_MARKS, KEYS.strikethrough];

function MarkToolbarButtons({ marks }: { marks: Mark[] }) {
    return (
        <ToolbarGroup>
            {marks.map((mark) => {
                const { icon: Icon, tooltip } = MARKS[mark];

                return (
                    <MarkToolbarButton
                        key={mark}
                        nodeType={mark}
                        tooltip={tooltip}
                    >
                        <Icon />
                    </MarkToolbarButton>
                );
            })}
        </ToolbarGroup>
    );
}

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
