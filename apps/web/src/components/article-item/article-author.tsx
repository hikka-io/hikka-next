import { ArticleResponse } from '@hikka/client';
import { formatDistance } from 'date-fns';
import { FC } from 'react';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { cn } from '@/utils/utils';

import FollowButton from '../follow-button';

interface Props {
    article: ArticleResponse;
    preview?: boolean;
    className?: string;
}

const Author: FC<Props> = ({ article, preview, className }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <HorizontalCard
            href={`/u/${article.author.username}`}
            className={cn('p-4', className)}
        >
            <HorizontalCardImage
                className={preview ? 'w-10' : ''}
                image={article.author.avatar}
                imageRatio={1}
            />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle>
                    {article.author.username}
                </HorizontalCardTitle>
                <HorizontalCardContainer className="flex-row items-center">
                    <HorizontalCardDescription
                        rel="author"
                        href={`/articles?categories=${article.category}`}
                    >
                        {ARTICLE_CATEGORY_OPTIONS[article.category].title_ua}
                    </HorizontalCardDescription>
                    <div className="size-1 rounded-full bg-muted-foreground" />
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
