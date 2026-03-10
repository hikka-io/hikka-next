import { CollectionContent, CollectionResponse } from '@hikka/client';
import { ArrowBigUp, Layers, MessageCircle } from 'lucide-react';
import { FC, memo } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import { cn } from '@/utils/cn';

interface Props {
    data: CollectionResponse<CollectionContent>;
    className?: string;
}

const CollectionItem: FC<Props> = ({ data, className }) => {
    const image = (content: CollectionContent) =>
        content.data_type === 'anime' ? content.image : content.image;

    return (
        <HorizontalCard
            className={className}
        >
            <HorizontalCardImage
                image={image(data.collection[0].content)}
                className={cn(data.nsfw && 'spoiler-blur-xs', 'w-12')}
                href={`/collections/${data.reference}`}
            />
            <HorizontalCardContainer>
                <div className="inline-flex items-center gap-2">
                    <HorizontalCardTitle
                        className={cn(data.spoiler && 'spoiler-blur-xs')}
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
                <HorizontalCardDescription
                    className={cn(data.spoiler && 'spoiler-blur-xs')}
                >
                    {data.description}
                </HorizontalCardDescription>
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
