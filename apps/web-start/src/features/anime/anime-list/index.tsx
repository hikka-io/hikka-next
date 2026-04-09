'use client';

import { queryKeys, useQueryClient } from '@hikka/react/core';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import AnimeCard from '@/components/content-card/anime-card';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack, { StackSize } from '@/components/ui/stack';

import { useCatalogView } from '@/features/anime/hooks/use-catalog-view';
import { useFiltersSidebar } from '@/features/filters/hooks/use-filters-sidebar';

import AnimeListSkeleton from './components/anime-list-skeleton';
import { useAnimeSearchQuery } from './use-anime-search-query';

interface Props {}

const AnimeList: FC<Props> = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { visible: sidebarVisible } = useFiltersSidebar();
    const { view } = useCatalogView();

    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
        args,
        paginationArgs,
    } = useAnimeSearchQuery();

    const handlePageChange = (newPage: number) => {
        if (data && data?.pages.length > 1) {
            queryClient.removeQueries({
                queryKey: queryKeys.anime.search({ args, paginationArgs }),
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
        return <AnimeListSkeleton />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    const extendedSize: StackSize =
        view === 'list' ? 1 : sidebarVisible ? 5 : 6;

    return (
        <Block className="isolate">
            <Stack extended={true} size={5} extendedSize={extendedSize}>
                {list.map((anime) => {
                    return <AnimeCard key={anime.slug} anime={anime} />;
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

export default AnimeList;
