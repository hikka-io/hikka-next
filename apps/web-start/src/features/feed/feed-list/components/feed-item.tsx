import { FC } from 'react';

import { ContentTypeEnum, UserResponse, VoteContentType } from '@hikka/client';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';

import { FeedItem as FeedItemType } from '../../types';
import FeedItemArticle from './feed-item-article';
import FeedItemCollection from './feed-item-collection';
import FeedItemComment from './feed-item-comment';
import FeedItemFooter from './feed-item-footer';
import FeedItemHeader from './feed-item-header';
import FeedItemHistory from './feed-item-history';

function getAuthor(item: FeedItemType): UserResponse {
    switch (item.data_type) {
        case ContentTypeEnum.ARTICLE:
            return item.data.author;
        case ContentTypeEnum.COLLECTION:
            return item.data.author;
        case ContentTypeEnum.COMMENT:
            return item.data.author;
        case ContentTypeEnum.HISTORY:
            return item.data.user;
    }
}

function getStats(item: FeedItemType): {
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
                commentsCount: item.data.comments_count,
                voteScore: item.data.vote_score,
                commentsHref: `/comments/article/${item.data.slug}`,
                contentType: ContentTypeEnum.ARTICLE,
                slug: item.data.slug,
                myScore: item.data.my_score,
            };
        case ContentTypeEnum.COLLECTION:
            return {
                commentsCount: item.data.comments_count,
                voteScore: item.data.vote_score,
                commentsHref: `/comments/collection/${item.data.reference}`,
                contentType: ContentTypeEnum.COLLECTION,
                slug: item.data.reference,
                myScore: item.data.my_score,
            };
        case ContentTypeEnum.COMMENT:
            return {
                commentsCount: 0,
                voteScore: item.data.vote_score,
                contentType: ContentTypeEnum.COMMENT,
                slug: item.data.reference,
                myScore: item.data.my_score,
            };
        case ContentTypeEnum.HISTORY:
            return {
                commentsCount: 0,
                voteScore: 0,
            };
    }
}

function getExtraInfo(item: FeedItemType): string | undefined {
    if (item.data_type === ContentTypeEnum.ARTICLE) {
        return ARTICLE_CATEGORY_OPTIONS[item.data.category]?.title_ua;
    }
    return undefined;
}

interface Props {
    item: FeedItemType;
}

const FeedItem: FC<Props> = ({ item }) => {
    const author = getAuthor(item);
    const stats = getStats(item);
    const extraInfo = getExtraInfo(item);

    return (
        <div className="flex flex-col isolate border-b last:border-b-0! first:backdrop-blur">
            <FeedItemHeader
                author={author}
                dataType={item.data_type}
                created={item.created}
                extraInfo={extraInfo}
            />

            <div className="ml-14">
                {item.data_type === ContentTypeEnum.HISTORY && (
                    <FeedItemHistory data={item.data} />
                )}
                {item.data_type === ContentTypeEnum.ARTICLE && (
                    <FeedItemArticle data={item.data} />
                )}
                {item.data_type === ContentTypeEnum.COLLECTION && (
                    <FeedItemCollection data={item.data} />
                )}
                {item.data_type === ContentTypeEnum.COMMENT && (
                    <FeedItemComment data={item.data} />
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
