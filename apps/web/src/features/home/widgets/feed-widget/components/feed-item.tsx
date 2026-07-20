import type { FC } from 'react';

import {
    type ArticleCategoryEnum,
    type ArticlePreviewResponse,
    type CollectionResponse,
    type CommentResponseFeed,
    ContentTypeEnum,
    type ReviewResponse,
    type VoteContentTypeEnum,
} from '@hikka/api';

import { HorizontalCardImage } from '@/components/ui/horizontal-card';
import { useTitle } from '@/features/auth/hooks/use-title';

import FeedItemArticle from './feed-item-article';
import FeedItemCollection from './feed-item-collection';
import FeedItemComment from './feed-item-comment';
import FeedItemFooter from './feed-item-footer';
import FeedItemHeader from './feed-item-header';

// The getFeed response union; each member carries a literal `data_type`
// ('article' | 'collection' | 'comment') that discriminates the switch below.
export type FeedItemResponse =
    | ArticlePreviewResponse
    | CollectionResponse
    | CommentResponseFeed;

// @hikka/api types `CommentResponseFeed.preview` as a loose `{ [key]: unknown }`.
type CommentPreview = { slug?: string; title?: string };

// The article `content` union exposes `data_type`/`slug` for the related entity.
type ArticleContentPreview = {
    data_type?: ContentTypeEnum;
    slug?: string;
};

type Reference = {
    contentType?: ContentTypeEnum;
    slug?: string;
    title?: string;
};

function getStats(item: FeedItemResponse): {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType?: VoteContentTypeEnum;
    slug?: string;
    myScore?: number;
} {
    switch (item.data_type) {
        case ContentTypeEnum.ARTICLE:
            return {
                commentsCount: item.comments_count,
                voteScore: item.vote_score,
                commentsHref: `/comments/article/${item.slug}`,
                contentType: ContentTypeEnum.ARTICLE,
                slug: item.slug,
                myScore: item.my_score,
            };
        case ContentTypeEnum.COLLECTION:
            return {
                commentsCount: item.comments_count,
                voteScore: item.vote_score,
                commentsHref: `/comments/collection/${item.reference}`,
                contentType: ContentTypeEnum.COLLECTION,
                slug: item.reference,
                myScore: item.my_score,
            };
        case ContentTypeEnum.COMMENT: {
            const preview = item.preview as CommentPreview;
            return {
                commentsCount: item.total_replies ?? 0,
                voteScore: item.vote_score,
                commentsHref: `/comments/${item.content_type}/${preview.slug}/${item.reference}`,
                contentType: ContentTypeEnum.COMMENT,
                slug: item.reference,
                myScore: item.my_score,
            };
        }
    }
}

function getShareUrl(item: FeedItemResponse): string {
    switch (item.data_type) {
        case ContentTypeEnum.ARTICLE:
            return `/articles/${item.slug}`;
        case ContentTypeEnum.COLLECTION:
            return `/collections/${item.reference}`;
        case ContentTypeEnum.COMMENT: {
            const preview = item.preview as CommentPreview;
            return `/comments/${item.content_type}/${preview.slug}/${item.reference}`;
        }
    }
}

type Props = {
    item: FeedItemResponse;
};

const FeedItem: FC<Props> = ({ item }) => {
    // Hooks run every render; pass null for non-article items.
    const articleContent =
        item.data_type === ContentTypeEnum.ARTICLE ? item.content : null;
    const articleTitle = useTitle(articleContent);

    const stats = getStats(item);
    const shareUrl = getShareUrl(item);

    let reference: Reference | undefined;
    let review: ReviewResponse | undefined;
    let category: ArticleCategoryEnum | undefined;

    if (item.data_type === ContentTypeEnum.COMMENT) {
        const preview = item.preview as CommentPreview;
        reference = {
            contentType: item.content_type as ContentTypeEnum,
            slug: preview.slug,
            title: preview.title,
        };
        review = item.review ?? undefined;
    } else if (item.data_type === ContentTypeEnum.ARTICLE) {
        category = item.category as ArticleCategoryEnum;
        const content = item.content as ArticleContentPreview | null;
        reference = content
            ? {
                  contentType: content.data_type,
                  slug: content.slug,
                  title: articleTitle,
              }
            : undefined;
    }

    return (
        <article className="flex items-start gap-4 p-4">
            <HorizontalCardImage
                className="w-10 shrink-0 sm:w-12"
                image={item.author.avatar}
                imageClassName="sm:rounded-lg"
                imageRatio={1}
                href={`/u/${item.author.username}`}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <FeedItemHeader
                    author={item.author}
                    dataType={item.data_type}
                    created={item.created}
                    review={review}
                    category={category}
                    reference={reference}
                    shareUrl={shareUrl}
                />

                <div className="flex flex-col gap-4">
                    {item.data_type === ContentTypeEnum.ARTICLE && (
                        <FeedItemArticle data={item} />
                    )}
                    {item.data_type === ContentTypeEnum.COLLECTION && (
                        <FeedItemCollection data={item} />
                    )}
                    {item.data_type === ContentTypeEnum.COMMENT && (
                        <FeedItemComment data={item} />
                    )}
                </div>

                <FeedItemFooter
                    commentsCount={stats.commentsCount}
                    voteScore={stats.voteScore}
                    commentsHref={stats.commentsHref}
                    contentType={stats.contentType}
                    slug={stats.slug}
                    myScore={stats.myScore}
                />
            </div>
        </article>
    );
};

export default FeedItem;
