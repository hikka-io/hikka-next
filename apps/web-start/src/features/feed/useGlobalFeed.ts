'use client';

import { useMemo } from 'react';

import { ContentTypeEnum } from '@hikka/client';
import { useLatestComments, useSearchArticles, useSearchCollections } from '@hikka/react';

import { FeedItem } from './types';

export function useGlobalFeed() {
    const { data: comments, isLoading: isCommentsLoading } = useLatestComments();

    const { list: articles, isLoading: isArticlesLoading } = useSearchArticles({
        args: {
            sort: ['created:desc'],
        },
        paginationArgs: {
            size: 15,
        },
    });

    const { list: collections, isLoading: isCollectionsLoading } = useSearchCollections({
        args: {
            sort: ['created:desc'],
        },
        paginationArgs: {
            size: 15,
        },
    });

    const isLoading = isCommentsLoading || isArticlesLoading || isCollectionsLoading;

    const feed = useMemo<FeedItem[]>(() => {
        const items: FeedItem[] = [];

        if (comments) {
            for (const comment of comments) {
                items.push({
                    reference: `comment-${comment.reference}`,
                    created: comment.created,
                    data_type: ContentTypeEnum.COMMENT,
                    data: comment,
                });
            }
        }

        if (articles) {
            for (const article of articles) {
                items.push({
                    reference: `article-${article.slug}`,
                    created: article.created,
                    data_type: ContentTypeEnum.ARTICLE,
                    data: article,
                });
            }
        }

        if (collections) {
            for (const collection of collections) {
                items.push({
                    reference: `collection-${collection.reference}`,
                    created: collection.created,
                    data_type: ContentTypeEnum.COLLECTION,
                    data: collection,
                });
            }
        }

        items.sort((a, b) => b.created - a.created);

        return items;
    }, [comments, articles, collections]);

    return { feed, isLoading };
}
