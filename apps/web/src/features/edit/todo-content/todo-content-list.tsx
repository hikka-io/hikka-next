import type { FC } from 'react';

import { range } from '@antfu/utils';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import PagePagination from '@/components/page-pagination';

import { TodoContentCard } from './todo-content-card';
import TodoContentCardSkeleton from './todo-content-card-skeleton';
import { useTodoContentQuery } from './use-todo-content-query';
import { useTodoFilters } from './use-todo-filters';

const LIST_CLASSNAME =
    'grid grid-cols-1 max-md:[&>*+*]:-mt-px md:grid-cols-2 md:gap-6';

const TodoContentList: FC = () => {
    const { contentType } = useTodoFilters();
    const {
        list,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        pagination,
        queryKey,
    } = useTodoContentQuery();

    const hasMultiplePages = Boolean(data && data.pages.length > 1);

    if (isLoading) {
        return (
            <div className={LIST_CLASSNAME}>
                {range(1, 7).map((v) => (
                    <TodoContentCardSkeleton key={v} />
                ))}
            </div>
        );
    }

    if (!list || list.length === 0) {
        return <FiltersNotFound search={{ tab: contentType }} />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className={LIST_CLASSNAME}>
                {list.map((item) => (
                    <TodoContentCard key={item.item.slug} {...item} />
                ))}
            </div>

            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                />
            )}

            {pagination && (
                <PagePagination
                    pagination={pagination}
                    resetQueryKey={hasMultiplePages ? queryKey : undefined}
                />
            )}
        </div>
    );
};

export default TodoContentList;
