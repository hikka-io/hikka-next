import type { FC } from 'react';

import { getArticlesInfiniteOptions } from '@hikka/api';

import LoadMoreButton from '@/components/load-more-button';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import ContentArticlesItem from './content-articles-item';

type Props = {
    content_type: 'anime' | 'manga' | 'novel';
};

const ContentArticlesModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useInfiniteList(
            getArticlesInfiniteOptions({
                body: {
                    content_type,
                    content_slug: String(params.slug),
                },
            }),
        );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list?.map((article) => (
                <ContentArticlesItem article={article} key={article.slug} />
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
