'use client';

import { ContentStatusEnum, MangaMediaEnum } from '@hikka/client';
import { useSearchMangas } from '@hikka/react';
import { queryKeys, useQueryClient } from '@hikka/react/core';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import MangaCard from '@/components/content-card/manga-card';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import { expandSort } from '@/features/filters/sort';

import type { MangaSearch } from '@/utils/search-schemas';

import MangaListSkeleton from './components/manga-list-skeleton';

interface Props {}

const MangaList: FC<Props> = () => {
    const queryClient = useQueryClient();
    const search = useFilterSearch<MangaSearch>();
    const router = useRouter();

    const query = search.search;
    const media_type = (search.types ?? []) as MangaMediaEnum[];
    const status = (search.statuses ?? []) as ContentStatusEnum[];
    const years = (search.years ?? []) as [number | null, number | null];
    const genres = search.genres ?? [];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;
    const only_translated = search.only_translated;
    const page = search.page || 1;

    const args = {
        query: query || undefined,
        media_type: media_type,
        status: status,
        years: years,
        genres: genres,
        score: score,
        only_translated: Boolean(only_translated),
        sort: expandSort('manga', search.sort, search.order),
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
    } = useSearchMangas({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

    const handlePageChange = (newPage: number) => {
        if (data && data?.pages.length > 1) {
            queryClient.removeQueries({
                queryKey: queryKeys.manga.search({ args, paginationArgs }),
            });
        }

        router.navigate({
            search: (prev: Record<string, unknown>) => ({
                ...prev,
                page: newPage,
            }),
            replace: true,
        } as any);
    };

    const handleLoadMore = async () => {
        await fetchNextPage();
    };

    if (isLoading && !isFetchingNextPage) {
        return <MangaListSkeleton />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block className="isolate">
            <Stack extended={true} size={5} extendedSize={5}>
                {list.map((manga) => {
                    return <MangaCard key={manga.slug} manga={manga} />;
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

export default MangaList;
