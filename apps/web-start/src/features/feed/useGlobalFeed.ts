'use client';

import { ContentTypeEnum } from '@hikka/client';
import {
    useCommentList,
    useFollowingHistory,
    useSearchArticles,
    useSearchCollections,
    useSession,
} from '@hikka/react';
import { useMemo } from 'react';

import { FeedItem } from './types';

export function useGlobalFeed() {
    const { user } = useSession();

    const { list: comments, isLoading: isCommentsLoading } = useCommentList({
        paginationArgs: {
            size: 15,
        },
    });

    const { list: articles, isLoading: isArticlesLoading } = useSearchArticles({
        args: {
            sort: ['created:desc'],
        },
        paginationArgs: {
            size: 15,
        },
    });

    const { list: collections, isLoading: isCollectionsLoading } =
        useSearchCollections({
            args: {
                sort: ['created:desc'],
            },
            paginationArgs: {
                size: 15,
            },
        });

    const { list: history, isLoading: isHistoryLoading } = useFollowingHistory({
        paginationArgs: {
            size: 15,
        },
        options: {
            enabled: !!user,
        },
    });

    const isLoading =
        isCommentsLoading ||
        isArticlesLoading ||
        isCollectionsLoading ||
        (!!user && isHistoryLoading);

    const feed = useMemo<FeedItem[]>(() => {
        const items: FeedItem[] = [];

        if (comments) {
            for (const comment of comments) {
                items.push({
                    reference: comment.reference,
                    created: comment.created,
                    data_type: ContentTypeEnum.COMMENT,
                    data: comment,
                });
            }
        }

        if (articles) {
            for (const article of articles) {
                items.push({
                    reference: article.slug,
                    created: article.created,
                    data_type: ContentTypeEnum.ARTICLE,
                    data: article,
                });
            }
        }

        if (collections) {
            for (const collection of collections) {
                items.push({
                    reference: collection.reference,
                    created: collection.created,
                    data_type: ContentTypeEnum.COLLECTION,
                    data: collection,
                });
            }
        }

        if (history) {
            for (const entry of history) {
                items.push({
                    reference: entry.reference,
                    created: entry.created,
                    data_type: ContentTypeEnum.HISTORY,
                    data: entry,
                });
            }
        }

        items.sort((a, b) => b.created - a.created);

        return items;
    }, [comments, articles, collections, history]);

    return { feed, isLoading };
}
