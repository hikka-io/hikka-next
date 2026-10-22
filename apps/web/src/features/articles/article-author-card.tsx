import type { FC, ReactNode } from 'react';

import type {
    ArticleCategoryEnum,
    ArticlePreviewResponse,
    FollowUserResponse,
} from '@hikka/api';
import { ARTICLE_CATEGORY } from '@hikka/core';

import { FollowButton } from '@/components/action-buttons';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import RelativeTime from '@/components/relative-time';
import TextLink from '@/components/ui/text-link';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';

type Author =
    | FollowUserResponse
    | Pick<FollowUserResponse, 'username' | 'avatar'>;

type Props = {
    article: Pick<ArticlePreviewResponse, 'category'> &
        Partial<Pick<ArticlePreviewResponse, 'draft' | 'updated'>> & {
            /** Without follow state (the editor's own user), no follow button is shown. */
            author: Author;
        };
    preview?: boolean;
    /** Replaces the publication date, e.g. with the editor's save status. */
    status?: ReactNode;
    className?: string;
};

const ArticleAuthorCard: FC<Props> = ({
    article,
    preview,
    status,
    className,
}) => {
    const isDesktop = useIsDesktop();

    // Generated responses type `category` as a plain string; narrow to the enum.
    const category = article.category as ArticleCategoryEnum;

    return (
        <HorizontalCard className={cn('p-4', className)}>
            <HorizontalCardImage
                className={preview ? 'w-10' : ''}
                image={article.author.avatar}
                imageClassName="sm:rounded-lg"
                imageRatio={1}
                href={`/u/${article.author.username}`}
            />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle href={`/u/${article.author.username}`}>
                    {article.author.username}
                </HorizontalCardTitle>
                <HorizontalCardContainer className="flex-row items-center">
                    <HorizontalCardDescription>
                        <TextLink
                            to="/articles"
                            search={{ categories: category }}
                            rel="author"
                            className="hover:underline"
                        >
                            {ARTICLE_CATEGORY[category].title_ua}
                        </TextLink>
                    </HorizontalCardDescription>
                    <div className="size-1 rounded-full bg-muted-foreground" />
                    {status ?? (
                        <HorizontalCardDescription
                            className={cn(
                                article.draft && 'line-clamp-1 leading-relaxed',
                            )}
                        >
                            {article.draft
                                ? 'Чернетка'
                                : article.updated !== undefined && (
                                      <RelativeTime value={article.updated} />
                                  )}
                        </HorizontalCardDescription>
                    )}
                </HorizontalCardContainer>
            </HorizontalCardContainer>
            {'is_followed' in article.author && (
                <FollowButton
                    iconOnly={!isDesktop || preview}
                    size={!isDesktop || preview ? 'icon-md' : 'md'}
                    user={article.author}
                />
            )}
        </HorizontalCard>
    );
};

export default ArticleAuthorCard;
