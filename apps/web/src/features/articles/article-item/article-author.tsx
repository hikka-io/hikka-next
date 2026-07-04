import type { FC } from 'react';

import { formatDistance } from 'date-fns';

import type {
    ArticleCategoryEnum,
    ArticleDocumentResponse,
    ArticlePreviewResponse,
} from '@hikka/api';

import { FollowButton } from '@/components/action-buttons';
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

type Props = {
    article: ArticlePreviewResponse | ArticleDocumentResponse;
    preview?: boolean;
    className?: string;
};

const Author: FC<Props> = ({ article, preview, className }) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');

    // Generated responses type `category` as a plain string; narrow to the enum.
    const category = article.category as ArticleCategoryEnum;

    return (
        <HorizontalCard className={cn('p-4', className)}>
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
                        <Link
                            to="/articles"
                            search={{ categories: category }}
                            rel="author"
                            className="hover:underline"
                        >
                            {ARTICLE_CATEGORY_OPTIONS[category].title_ua}
                        </Link>
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
