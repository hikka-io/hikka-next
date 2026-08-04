import { type FC } from 'react';

import { range } from '@antfu/utils';

import { ContentTypeEnum } from '@hikka/api';

import SkeletonCard from '@/components/content-card/content-card-skeleton';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import { StickyPagination } from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { cn } from '@/utils/cn';
import type { EditContentSearch } from '@/utils/search-schemas';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
    type TodoContentType,
    useTodoContentList,
} from './hooks/use-todo-content-list';
import { TodoContentCard } from './todo-content/todo-content-card';
import {
    TodoFilters,
    type TodoFiltersValue,
} from './todo-content/todo-filters';
import { TodoListSummary } from './todo-content/todo-list-summary';
import { TodoNavbar } from './todo-content/todo-navbar';

type Props = {
    extended?: boolean;
};

const OPTIONS = [
    { value: 'title_ua', label: 'Аніме без назв' },
    {
        value: 'synopsis_ua',
        label: 'Аніме без опису',
    },
];

const ContentList: FC<Props> = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { preferences } = useSessionUI();
    const search = useFilterSearch<EditContentSearch>();
    const page = search.page || 1;
    const contentType: TodoContentType = search.tab ?? ContentTypeEnum.ANIME;

    const filters: TodoFiltersValue = {
        title_ua: search.title_ua,
        title_en: search.title_en,
        title_original: search.title_original,
        synopsis_ua: search.synopsis_ua,
        synopsis_en: search.synopsis_en,
        media_type: search.media_type,
        mal_id: search.mal_id,
        name_ua: search.name_ua,
        name_en: search.name_en,
        name_original: search.name_original,
        description_ua: search.description_ua,
        content_type: search.content_type,
        content_slug: search.content_slug,
    };

    const handleFiltersChange = (value: TodoFiltersValue) => {
        navigate({
            to: '.',
            search: (prev) => ({ ...prev, ...value }),
        });
    };

    const handleContentTypeChange = (val: ContentTypeEnum) => {
        navigate({
            to: '.',
            search: (prev) => ({ page: prev.page, tab: val }),
        });
    };

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

    if (isLoading && !isFetchingNextPage) {
        return (
            <Stack extended size={5} extendedSize={7}>
                {range(1, 21).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </Stack>
        );
    }

    let sidebarVisible = true;

    return (
        <Block>
            <div
                className={cn(
                    'grid grid-cols-1 lg:items-start lg:gap-x-10',
                    sidebarVisible &&
                        'lg:grid-cols-[1fr_30%] xl:grid-cols-[1fr_25%]',
                )}
            >
                <div className="flex flex-col gap-4">
                    <TodoNavbar
                        contentType={contentType}
                        onContentTypeChange={handleContentTypeChange}
                    />
                    <TodoListSummary
                        total={pagination?.total}
                        isLoading={isLoading}
                    />

                    {list == null || list.length === 0 ? (
                        <FiltersNotFound />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
                            {list.map((item) => (
                                <TodoContentCard
                                    key={item.item.slug}
                                    {...item}
                                />
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

                {sidebarVisible && (
                    <div className="sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border surface lg:order-2 lg:flex">
                        <TodoFilters
                            contentType={contentType}
                            value={filters}
                            onChange={handleFiltersChange}
                        />
                    </div>
                )}
            </div>
        </Block>
    );
};

export default ContentList;
