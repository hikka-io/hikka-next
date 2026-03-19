'use client';

import { ArticleContentType } from '@hikka/client';
import { useSearchArticles } from '@hikka/react';
import { useParams } from '@/utils/navigation';
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
        <div className="-mx-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list &&
                list.map((article) => (
                    <ContentArticlesItem
                        article={article}
                        key={article.slug}
                    />
                ))}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default ContentArticlesModal;
