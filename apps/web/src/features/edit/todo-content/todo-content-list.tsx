import type { FC } from 'react';

import { range } from '@antfu/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import { StickyPagination } from '@/components/ui/pagination';

import { useTodoContentQuery } from '../hooks/use-todo-content-query';
import { useTodoFilters } from '../hooks/use-todo-filters';
import { TodoContentCard } from './todo-content-card';
import TodoContentCardSkeleton from './todo-content-card-skeleton';

const LIST_CLASSNAME =
    'grid grid-cols-1 max-md:[&>*+*]:-mt-px md:grid-cols-2 md:gap-6';

const TodoContentList: FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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

    const handlePageChange = (newPage: number) => {
        if (hasMultiplePages) {
            queryClient.removeQueries({ queryKey });
        }

        navigate({
            to: '.',
            search: (prev) => ({ ...prev, page: newPage }),
        });
    };

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
                <StickyPagination
                    page={pagination.page}
                    pages={pagination.pages}
                    setPage={handlePageChange}
                />
            )}
        </div>
    );
};

export default TodoContentList;
