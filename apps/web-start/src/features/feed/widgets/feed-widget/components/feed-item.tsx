import {
    ContentTypeEnum,
    FeedItemResponse,
    VoteContentType,
} from '@hikka/client';
import { FC } from 'react';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

import FeedItemArticle from './feed-item-article';
import FeedItemCollection from './feed-item-collection';
import FeedItemComment from './feed-item-comment';
import FeedItemFooter from './feed-item-footer';
import FeedItemHeader from './feed-item-header';

function getStats(item: FeedItemResponse): {
    commentsCount: number;
    voteScore: number;
    commentsHref?: string;
    contentType?: VoteContentType;
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
        case ContentTypeEnum.COMMENT:
            return {
                commentsCount: item.total_replies,
                voteScore: item.vote_score,
                commentsHref: `/comments/${item.content_type}/${item.preview.slug}/${item.reference}`,
                contentType: ContentTypeEnum.COMMENT,
                slug: item.reference,
                myScore: item.my_score,
            };
    }
}

function getExtraInfo(item: FeedItemResponse): string | undefined {
    if (item.data_type === ContentTypeEnum.ARTICLE) {
        return ARTICLE_CATEGORY_OPTIONS[item.category]?.title_ua;
    }
    return undefined;
}

interface Props {
    item: FeedItemResponse;
    showTypeLabel?: boolean;
}

const FeedItem: FC<Props> = ({ item, showTypeLabel }) => {
    const stats = getStats(item);
    const extraInfo = getExtraInfo(item);

    return (
        <div className="isolate flex flex-col border-b">
            <FeedItemHeader
                author={item.author}
                dataType={item.data_type}
                created={item.created}
                extraInfo={extraInfo}
                showTypeLabel={showTypeLabel}
            />

            <div className="ml-14">
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
