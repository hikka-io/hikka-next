import { type ComponentProps, type FC, memo, useRef } from 'react';

import { Info } from 'lucide-react';

import type { CollectionContentResponse } from '@hikka/api';

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
import { useSessionUI } from '@/services/hooks/use-session-ui';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { getTitle } from '@/utils/title/get-title';

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
        <button
            type="button"
            className="flex size-7 items-center justify-center rounded-md bg-secondary/80 backdrop-blur transition-colors hover:bg-secondary"
        >
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

type Props = {
    group?: string;
    items: CollectionContentResponse[];
    content_type: string;
};

const CollectionDisplayGrid: FC<Props> = ({ group, items, content_type }) => {
    const { preferences } = useSessionUI();

    const contentType = content_type as NonNullable<
        ComponentProps<typeof ContentCard>['content_type']
    >;

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
                            content_type={contentType}
                            href={`${CONTENT_TYPE_LINKS[contentType]}/${item.content.slug}`}
                            image={item.content.image}
                            title={getTitle(
                                item.content,
                                preferences.title_language,
                                preferences.name_language,
                            )}
                            watch={
                                'watch' in item.content &&
                                item.content.watch.length > 0
                                    ? (item.content.watch[0] as ComponentProps<
                                          typeof ContentCard
                                      >['watch'])
                                    : undefined
                            }
                            read={
                                'read' in item.content &&
                                item.content.read.length > 0
                                    ? (item.content.read[0] as ComponentProps<
                                          typeof ContentCard
                                      >['read'])
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
                                <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-12 w-full rounded-b-md bg-linear-to-t from-background/60 to-transparent" />
                            </div>
                        )}
                    </div>
                ))}
            </Stack>
        </div>
    );
};

export default memo(CollectionDisplayGrid);
