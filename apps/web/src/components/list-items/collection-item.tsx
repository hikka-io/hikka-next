import { type FC, memo } from 'react';

import { ArrowBigUp, Layers, MessageCircle } from 'lucide-react';

import type { CollectionContentResponse, CollectionResponse } from '@hikka/api';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { MDViewer } from '@/components/markdown';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { cn } from '@/utils/cn';

type Props = {
    data: CollectionResponse;
    className?: string;
};

const CollectionItem: FC<Props> = ({ data, className }) => {
    const image = (content: CollectionContentResponse['content']) =>
        content.image;

    return (
        <HorizontalCard className={className}>
            <HorizontalCardImage
                image={image(data.collection[0].content)}
                className="w-12"
                imageBlur={data.nsfw || data.spoiler}
                href={`/collections/${data.reference}`}
            />
            <HorizontalCardContainer>
                <div className="inline-flex items-center gap-2">
                    <HorizontalCardTitle
                        href={`/collections/${data.reference}`}
                    >
                        {data.title}
                    </HorizontalCardTitle>
                    {data.spoiler && (
                        <div className="size-2 rounded-full bg-warning-foreground" />
                    )}
                    {data.nsfw && (
                        <div className="size-2 rounded-full bg-destructive-foreground" />
                    )}
                </div>
                <MDViewer
                    className={cn(
                        'prose-inline line-clamp-1 text-muted-foreground text-xs!',
                        data.spoiler && 'spoiler-blur-sm',
                    )}
                    preview
                >
                    {data.description}
                </MDViewer>
                <StatItemGroup size="sm">
                    <StatItem size="sm">
                        <Layers />
                        <small>{data.entries}</small>
                    </StatItem>
                    <StatItem size="sm">
                        <MessageCircle />
                        <small>{data.comments_count}</small>
                    </StatItem>
                    <StatItem size="sm">
                        <ArrowBigUp className="size-4!" />
                        <small>{data.vote_score}</small>
                    </StatItem>
                </StatItemGroup>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default memo(CollectionItem);
