import { ArticleBaseResponse } from '@hikka/client';
import { formatDistance } from 'date-fns';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import Link from '@/components/ui/link';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

import { FollowButton } from '@/features/common';

interface Props {
    article: ArticleBaseResponse;
    preview?: boolean;
    className?: string;
}

const Author: FC<Props> = ({ article, preview, className }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <HorizontalCard
            className={cn('p-4', className)}
        >
            <HorizontalCardImage
                className={preview ? 'w-10' : ''}
                image={article.author.avatar}
                imageRatio={1}
                href={`/u/${article.author.username}`}
            />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle href={`/u/${article.author.username}`}>
                    {article.author.username}
                </HorizontalCardTitle>
                <HorizontalCardContainer className="flex-row items-center">
                    <HorizontalCardDescription>
                        <Link to={`/articles?categories=${article.category}`} rel="author" className="hover:underline">
                            {ARTICLE_CATEGORY_OPTIONS[article.category].title_ua}
                        </Link>
                    </HorizontalCardDescription>
                    <div className="bg-muted-foreground size-1 rounded-full" />
                    <HorizontalCardDescription>
                        {article.draft
                            ? 'Чернетка'
                            : formatDistance(
                                article.updated * 1000,
                                Date.now(),
                                {
                                    addSuffix: true,
                                },
                            )}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCardContainer>
            <FollowButton
                iconOnly={!isDesktop || preview}
                size={!isDesktop || preview ? 'icon-md' : 'md'}
                user={article.author}
            />
        </HorizontalCard>
    );
};

export default Author;
