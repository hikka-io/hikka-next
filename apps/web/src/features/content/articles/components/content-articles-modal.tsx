import type { FC } from 'react';

import { range } from '@antfu/utils';

import {
    getArticlesInfiniteOptions,
    type MainContentTypeEnum,
} from '@hikka/api';

import MaterialSymbolsDynamicFeedRounded from '@/components/icons/material-symbols/MaterialSymbolsDynamicFeedRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import {
    ArticlePreviewCard,
    ArticlePreviewCardSkeleton,
} from '@/features/articles';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

const SKELETON_COUNT = 5;

type Props = {
    content_type: MainContentTypeEnum;
};

const ContentArticlesModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
        ref,
    } = useInfiniteList(
        getArticlesInfiniteOptions({
            body: {
                content_type,
                content_slug: String(params.slug),
            },
        }),
    );

    return (
        <div className="-m-4 flex flex-1 flex-col overflow-y-scroll p-4">
            <div className="-mx-2 flex flex-col">
                {isLoading &&
                    range(0, SKELETON_COUNT).map((index) => (
                        <ArticlePreviewCardSkeleton key={index} />
                    ))}
                {list?.map((article) => (
                    <ArticlePreviewCard article={article} key={article.slug} />
                ))}
            </div>
            {!isLoading && list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsDynamicFeedRounded />}
                    title="Статей ще немає"
                    description="Тут з’являться статті, пов’язані з цим тайтлом"
                />
            )}
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
