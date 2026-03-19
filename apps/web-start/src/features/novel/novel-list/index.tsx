'use client';

import { ContentStatusEnum, NovelMediaEnum } from '@hikka/client';
import { useSearchNovels } from '@hikka/react';
import { queryKeys, useQueryClient } from '@hikka/react/core';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import NovelCard from '@/components/content-card/novel-card';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import type { NovelSearch } from '@/utils/search-schemas';

import NovelListSkeleton from './components/novel-list-skeleton';

interface Props {}

const NovelList: FC<Props> = () => {
    const queryClient = useQueryClient();
    const search = useFilterSearch<NovelSearch>();
    const router = useRouter();

    const query = search.search;
    const media_type = (search.types ?? []) as NovelMediaEnum[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;
    const only_translated = search.only_translated;
    const sort = search.sort?.length ? search.sort : ['score'];
    const order = search.order || 'desc';
    const page = search.page || 1;

    const args = {
        query: query || undefined,
        media_type: media_type,
        status: status,
        years: years,
        genres: genres,
        score: score,
        only_translated: Boolean(only_translated),
        sort: sort ? sort.map((item) => `${item}:${order}`) : undefined,
    };

    const paginationArgs = {
        page: page,
    };

    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
    } = useSearchNovels({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

    const handlePageChange = (newPage: number) => {
        if (data && data?.pages.length > 1) {
            queryClient.removeQueries({
                queryKey: queryKeys.novel.search({ args, paginationArgs }),
            });
        }

        router.navigate({
            search: (prev: Record<string, unknown>) => ({ ...prev, page: newPage }),
            replace: true,
        } as any);
    };

    const handleLoadMore = async () => {
        await fetchNextPage();
    };

    if (isLoading && !isFetchingNextPage) {
        return <NovelListSkeleton />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block className="isolate">
            <Stack extended={true} size={5} extendedSize={5}>
                {list.map((novel) => {
                    return <NovelCard key={novel.slug} novel={novel} />;
                })}
            </Stack>
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={handleLoadMore}
                />
            )}
            {list && pagination && pagination.pages > 1 && (
                <div className="sticky bottom-4 z-10 mx-auto flex w-fit items-center">
                    <Card className="bg-secondary/60 flex-row gap-2 border-none px-3 py-2 backdrop-blur-xl">
                        <Pagination
                            page={pagination.page}
                            pages={pagination.pages}
                            setPage={handlePageChange}
                        />
                    </Card>
                </div>
            )}
        </Block>
    );
};

export default NovelList;
