'use client';

import { ArticleContentType } from '@hikka/client';
import { useSearchArticles } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import ContentArticlesItem from './content-articles-item';

interface Props {
    content_type: ArticleContentType;
}

const ContentArticlesModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useSearchArticles({
            args: {
                content_type: content_type,
                content_slug: String(params.slug),
            },
        });

    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {list &&
                list.map((article) => (
                    <ContentArticlesItem
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

export default ContentArticlesModal;
