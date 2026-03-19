'use client';

import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeStatusEnum,
    SeasonEnum,
} from '@hikka/client';
import { useSearchAnimes } from '@hikka/react';
import { queryKeys, useQueryClient } from '@hikka/react/core';
import { useRouter } from '@tanstack/react-router';
import { FC } from 'react';

import AnimeCard from '@/components/content-card/anime-card';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import type { AnimeSearch } from '@/utils/search-schemas';
import { getSeasonByOffset } from '@/utils/season';

import AnimeListSkeleton from './components/anime-list-skeleton';

interface Props {}

const AnimeList: FC<Props> = () => {
    const queryClient = useQueryClient();
    const search = useFilterSearch<AnimeSearch>();
    const router = useRouter();

    const query = search.search;
    const media_type = (search.types ?? []) as AnimeMediaEnum[];
    const status = (search.statuses ?? []) as AnimeStatusEnum[];
    const season = (search.seasons ?? []) as SeasonEnum[];
    const rating = (search.ratings ?? []) as AnimeAgeRatingEnum[];
    const years = search.years ?? [];
    const genres = search.genres ?? [];
    const studios = search.studios ?? [];
    const date_range = (search.date_range ?? []) as [number, number];
    const score = search.score?.length
        ? (search.score as [number, number])
        : undefined;
    const only_translated = search.only_translated;
    const sort = search.sort?.length ? search.sort : ['score'];
    const order = search.order || 'desc';
    const page = search.page || 1;

    const convertYears = () => {
        if (date_range && date_range.length === 2) {
            return [
                getSeasonByOffset(date_range[0]),
                getSeasonByOffset(date_range[1]),
            ];
        }

        return years;
    };

    const args = {
        query: query || undefined,
        media_type: media_type,
        status: status,
        season: season,
        rating: rating,
        years: convertYears(),
        genres: genres,
        studios: studios,
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
    } = useSearchAnimes({
        args,
        paginationArgs,
        options: {
            initialPageParam: page,
        },
    });

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

    return (
        <Block className="isolate">
            <Stack extended={true} size={5} extendedSize={5}>
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
