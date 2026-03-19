'use client';

import {
    CollectionContent,
    CollectionContentResponse,
    ContentTypeEnum,
} from '@hikka/client';
import { Info } from 'lucide-react';
import { FC, memo, useRef } from 'react';

import ContentCard, {
    DEFAULT_CONTAINER_RATIO,
} from '@/components/content-card/content-card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import Stack from '@/components/ui/stack';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { useScrollGradientMask } from '@/services/hooks/use-scroll-position';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';

const ASPECT_RATIO = String(DEFAULT_CONTAINER_RATIO);

const ScrollableComment: FC<{ comment: string }> = ({ comment }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { gradientClassName } = useScrollGradientMask(ref);

    return (
        <div
            ref={ref}
            className={`max-h-48 max-w-64 overflow-y-auto p-4 py-3 ${gradientClassName}`}
        >
            {comment}
        </div>
    );
};

const CommentButton: FC<{ comment: string }> = ({ comment }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    const trigger = (
        <button className="bg-secondary/80 hover:bg-secondary flex size-7 items-center justify-center rounded-md backdrop-blur transition-colors">
            <Info className="size-4" />
        </button>
    );

    if (isDesktop) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent side="top" className="p-0">
                        <ScrollableComment comment={comment} />
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent side="top" className="p-0 text-sm">
                <ScrollableComment comment={comment} />
            </PopoverContent>
        </Popover>
    );
};

interface Props {
    group?: string;
    items: CollectionContentResponse<CollectionContent>[];
    content_type: ContentTypeEnum;
}

const CollectionGrid: FC<Props> = ({ group, items, content_type }) => {
    return (
        <div className="flex scroll-mt-20 flex-col gap-4" id={group}>
            {group && (
                <Header href={`#${group}`}>
                    <HeaderContainer>
                        <HeaderTitle variant="h5">{group}</HeaderTitle>
                    </HeaderContainer>
                </Header>
            )}
            <Stack size={5} extendedSize={5} extended>
                {items.map((item) => (
                    <div key={item.content.slug} className="relative">
                        <ContentCard
                            slug={item.content.slug}
                            content_type={content_type}
                            href={`${CONTENT_TYPE_LINKS[content_type]}/${item.content.slug}`}
                            image={item.content.image}
                            title={item.content.title}
                            watch={
                                'watch' in item.content &&
                                item.content.watch.length > 0
                                    ? item.content.watch[0]
                                    : undefined
                            }
                            read={
                                'read' in item.content &&
                                item.content.read.length > 0
                                    ? item.content.read[0]
                                    : undefined
                            }
                        />
                        {item.comment && (
                            <div
                                className="pointer-events-none absolute top-0 left-0 w-full"
                                style={{ aspectRatio: ASPECT_RATIO }}
                            >
                                <div className="pointer-events-auto absolute right-2 bottom-2 z-1">
                                    <CommentButton comment={item.comment} />
                                </div>
                                <div className="from-background/60 pointer-events-none absolute bottom-0 left-0 z-0 h-12 w-full rounded-b-md bg-linear-to-t to-transparent" />
                            </div>
                        )}
                    </div>
                ))}
            </Stack>
        </div>
    );
};

export default memo(CollectionGrid);
