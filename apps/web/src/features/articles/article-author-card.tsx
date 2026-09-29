import type { FC } from 'react';

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
} from '@/components/horizontal-card';
import RelativeTime from '@/components/relative-time';
import TextLink from '@/components/ui/text-link';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { ARTICLE_CATEGORY } from '@/utils/labels/enum-labels';

type Props = {
    article: ArticlePreviewResponse | ArticleDocumentResponse;
    preview?: boolean;
    className?: string;
};

const ArticleAuthorCard: FC<Props> = ({ article, preview, className }) => {
    const isDesktop = useIsDesktop();

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
                    <HorizontalCardDescription
                        className={cn(
                            article.draft && 'line-clamp-1 leading-relaxed',
                        )}
                    >
                        {article.draft ? (
                            'Чернетка'
                        ) : (
                            <RelativeTime value={article.updated} />
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

export default ArticleAuthorCard;
