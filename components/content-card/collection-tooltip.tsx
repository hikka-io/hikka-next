'use client';

import ContentCard from '@/components/content-card/content-card';
import MDViewer from '@/components/markdown/viewer/MD-viewer';
import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui//avatar';
import { Badge } from '@/components/ui/badge';

import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import Link from '@/components/ui/link';
import useCollection from '@/services/hooks/collections/use-collection';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';
import { cn } from '@/utils/utils';
import { FC, PropsWithChildren, memo } from 'react';

import BxBxsUpvote from '~icons/bx/bxs-upvote';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

interface TooltipDataProps {
    reference: string;
}

interface Props extends PropsWithChildren {
    reference?: string;
    withTrigger?: boolean;
}

const TooltipData: FC<TooltipDataProps> = ({ reference }) => {
    const { data } = useCollection({ reference });
    const poster = (content: API.MainContent) =>
        content.data_type === 'anime' ? content.poster : content.image;
            
    if (!data) {
        return (
            <div className="flex w-90 flex-col gap-4 text-left rounded-lg">
                <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary/60" />
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="h-5 w-40 rounded-lg bg-secondary/60" />
                        <div className="flex gap-2">
                            <div className="h-2 w-10 rounded-lg bg-secondary/60" />
                            <div className="h-2 w-10 rounded-lg bg-secondary/60" />
                            <div className="h-2 w-10 rounded-lg bg-secondary/60" />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="h-5 w-16 rounded-lg bg-secondary/60" />
                    <div className="h-5 w-16 rounded-lg bg-secondary/60" />
                    <div className="h-5 w-16 rounded-lg bg-secondary/60" />
                    </div>
                <div className="flex flex-col gap-2">
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                    <div className="h-2 w-full rounded-lg bg-secondary/60" />
                </div>
                <div className="flex gap-2">
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                    <div className="h-14 w-10 rounded-lg bg-secondary/60" />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex w-80 flex-col gap-4">
                <div className={cn('flex gap-2')}>
                    <Link
                        href={`/u/${data.author.username}`}
                    >
                        <Avatar className="rounded-md size-12">
                            <AvatarImage
                                className="rounded-md"
                                src={data.author.avatar}
                            />
                            <AvatarFallback className="rounded-md" />
                        </Avatar>
                    </Link>
                    <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-4">
                            <Link
                                className={cn('text-left')}
                                href={`/collections/${data.reference}`}
                            >
                                <H5
                                    className={cn('line-clamp-1 cursor-pointer')}
                                >
                                    {data.title}
                                </H5>
                            </Link>
                        </div>
                        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex gap-1">
                                <MaterialSymbolsGridViewRounded />
                                <Small>{data.entries}</Small>
                            </div>
                            <div className="flex gap-1">
                                <IconamoonCommentFill />
                                <Small>{data.comments_count}</Small>
                            </div>
                            <div className="flex gap-1">
                                <BxBxsUpvote />
                                <Small>{data.vote_score}</Small>
                            </div>
                        </div>
                    </div>
                </div>
                {(data.spoiler || data.nsfw || (data.tags.length > 0)) && (
                    <div className="flex flex-wrap gap-2">
                        {data.spoiler && (
                            <Badge variant="warning">Спойлери</Badge>
                        )}
                        {data.nsfw && (
                            <Badge variant="destructive">+18</Badge>
                        )}
                        {data.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}
                            </Badge>
                        ))}
                    </div>
                )}
                <MDViewer className="whitespace-normal break-normal text-sm text-muted-foreground md:line-clamp-5">
                    {data.description}
                </MDViewer>
                <div className='flex gap-2'>
                    {data.collection.slice(0,7).map((item) => (
                        <ContentCard
                            className="w-10"
                            href={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.content.slug}`}
                            key={item.content.slug}
                            poster={poster(item.content)}
                            slug={item.content.slug}
                            content_type={item.content_type}
                            containerRatio={0.7}
                        />
                        ))}
                    {data.collection.length >= 7 && (
                        <ContentCard
                            className="w-10"
                            href={`/collections/${data.reference}`}
                            poster={
                                <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                            }
                            containerRatio={0.7}
                        />
                    )}
                </div>
            </div>
        </>
    );
    
};

const CollectionTooltip: FC<Props> = ({
    reference,
    children,
    withTrigger,
    ...props
}) => {
    if (!reference) {
        return null;
    }

    return (
        <HoverCard openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>{children}</HoverCardTrigger>
            <HoverCardPortal>
                <HoverCardContent
                    side="right"
                    className="hidden min-w-min flex-col gap-4 p-4 md:flex"
                >
                    <HoverCardArrow />
                    <TooltipData reference={reference} />
                </HoverCardContent>
            </HoverCardPortal>
        </HoverCard>
    );
};

export default memo(CollectionTooltip);
