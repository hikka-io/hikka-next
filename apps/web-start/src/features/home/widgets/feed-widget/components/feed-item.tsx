import type { FC } from 'react';

import {
    type AppVoteSchemasContentTypeEnum,
    type ArticleCategoryEnum,
    type ArticlePreviewResponse,
    type CollectionResponse,
    type CommentResponseFeed,
    ContentTypeEnum,
} from '@hikka/api';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

import FeedItemArticle from './feed-item-article';
import FeedItemCollection from './feed-item-collection';
import FeedItemComment from './feed-item-comment';
import FeedItemFooter from './feed-item-footer';
import FeedItemHeader from './feed-item-header';

// The generated `getFeed` response is `ArticlePreviewResponse |
// CommentResponseFeed | CollectionResponse`, but @hikka/api types every
// member's `data_type` as a loose `string`, so the union does not discriminate.
// Re-attach the literal `data_type` per member so the `switch` below narrows
// into a discriminated union over the feed item content types.
type FeedArticleItem = ArticlePreviewResponse & {
    data_type: typeof ContentTypeEnum.ARTICLE;
};
type FeedCollectionItem = CollectionResponse & {
    data_type: typeof ContentTypeEnum.COLLECTION;
};
type FeedCommentItem = CommentResponseFeed & {
    data_type: typeof ContentTypeEnum.COMMENT;
};
export type FeedItemResponse =
    | FeedArticleItem
    | FeedCollectionItem
    | FeedCommentItem;

// @hikka/api types `CommentResponseFeed.preview` as a loose `{ [key]: unknown }`.
type CommentPreview = { slug?: string };

function getStats(item: FeedItemResponse): {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType?: AppVoteSchemasContentTypeEnum;
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

function getExtraInfo(item: FeedItemResponse): string | undefined {
    if (item.data_type === ContentTypeEnum.ARTICLE) {
        return ARTICLE_CATEGORY_OPTIONS[item.category as ArticleCategoryEnum]
            ?.title_ua;
    }
    return undefined;
}

type Props = {
    item: FeedItemResponse;
    showTypeLabel?: boolean;
};

const FeedItem: FC<Props> = ({ item, showTypeLabel }) => {
    const stats = getStats(item);
    const extraInfo = getExtraInfo(item);

    return (
        <div className="feed-item isolate flex flex-col border-b">
            <FeedItemHeader
                author={item.author}
                dataType={item.data_type}
                created={item.created}
                extraInfo={extraInfo}
                showTypeLabel={showTypeLabel}
            />

            <div className="feed-item-content ml-14">
                {item.data_type === ContentTypeEnum.ARTICLE && (
                    <FeedItemArticle data={item} />
                )}
                {item.data_type === ContentTypeEnum.COLLECTION && (
                    <FeedItemCollection data={item} />
                )}
                {item.data_type === ContentTypeEnum.COMMENT && (
                    <FeedItemComment data={item} />
                )}

                <FeedItemFooter
                    commentsCount={stats.commentsCount}
                    voteScore={stats.voteScore}
                    commentsHref={stats.commentsHref}
                    contentType={stats.contentType}
                    slug={stats.slug}
                    myScore={stats.myScore}
                />
            </div>
        </div>
    );
};

export default FeedItem;
