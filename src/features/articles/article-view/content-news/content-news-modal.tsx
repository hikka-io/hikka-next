'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import useArticles from '@/services/hooks/articles/use-articles';

import ContentNewsItem from './content-news-item';

interface Props {
    content_type: API.ContentType;
}

const ContentNewsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useArticles({
            category: 'news',
            content_type: content_type,
            content_slug: String(params.slug),
        });

    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {list &&
                list.map((article) => (
                    <ContentNewsItem
                        className="px-6 py-4"
                        article={article}
                        key={article.slug}
                    />
                ))}
            {hasNextPage && (
                <div className="px-6">
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                </div>
            )}
        </div>
    );
};

export default ContentNewsModal;