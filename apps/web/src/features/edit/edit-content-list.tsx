import type { FC } from 'react';

import { range } from '@antfu/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import { StickyPagination } from '@/components/ui/pagination';
import { FiltersButton } from '@/features/filters';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import type { EditContentSearch } from '@/utils/search-schemas';

import { useTodoContentList } from './hooks/use-todo-content-list';
import { useTodoFilters } from './hooks/use-todo-filters';
import {
    TodoContentCard,
    TodoContentCardSkeleton,
    TodoFilters,
    TodoFiltersModal,
    TodoListSummary,
} from './todo-content';

const LIST_CLASSNAME =
    'grid grid-cols-1 max-md:[&>*+*]:-mt-px md:grid-cols-2 md:gap-6';

const EditContentList: FC = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const page = useFilterSearch<EditContentSearch>().page || 1;
    const { contentType, filters, activeCount, setFilters } = useTodoFilters();

    const {
        list,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        pagination,
        queryKey,
    } = useTodoContentList(
        contentType,
        {
            ...filters,
            size: 20,
        },
        Number(page),
    );

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_30%] lg:items-start lg:gap-x-10 xl:grid-cols-[1fr_25%]">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <TodoListSummary
                        total={pagination?.total}
                        isLoading={isLoading}
                    />
                    <FiltersButton
                        className="lg:hidden"
                        count={activeCount}
                        renderModal={(props) => (
                            <TodoFiltersModal
                                {...props}
                                contentType={contentType}
                                value={filters}
                                onChange={setFilters}
                            />
                        )}
                    />
                </div>

                {isLoading ? (
                    <div className={LIST_CLASSNAME}>
                        {range(1, 7).map((v) => (
                            <TodoContentCardSkeleton key={v} />
                        ))}
                    </div>
                ) : !list || list.length === 0 ? (
                    <FiltersNotFound search={{ tab: contentType }} />
                ) : (
                    <div className={LIST_CLASSNAME}>
                        {list.map((item) => (
                            <TodoContentCard key={item.item.slug} {...item} />
                        ))}
                    </div>
                )}

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

            <div className="sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border surface lg:order-2 lg:flex">
                <TodoFilters
                    contentType={contentType}
                    value={filters}
                    onChange={setFilters}
                />
            </div>
        </div>
    );
};

export default EditContentList;
