'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import FiltersNotFound from '@/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';
import useAnimeCatalog from '@/services/hooks/anime/use-anime-catalog';
import AnimeListSkeleton from './anime-list-skeleton';
import { useNextPage, useUpdatePage } from './anime-list.hooks';

interface Props {}

const AnimeList: FC<Props> = () => {
    const searchParams = useSearchParams();

    const query = searchParams.get('search');
    const media_type = searchParams.getAll('types');
    const status = searchParams.getAll('statuses');
    const season = searchParams.getAll('seasons');
    const rating = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const studios = searchParams.getAll('studios');

    const only_translated = searchParams.get('only_translated');

    const sort = searchParams.get('sort') || 'score';
    const order = searchParams.get('order') || 'desc';

    const page = searchParams.get('page');
    const iPage = searchParams.get('iPage');

    const dataKeys = {
        query,
        media_type,
        status,
        season,
        rating,
        years,
        genres,
        studios,
        only_translated: Boolean(only_translated),
        sort: sort ? [`${sort}:${order}`] : undefined,
        page: Number(page),
        iPage: Number(iPage),
    };

    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        list,
        pagination,
    } = useAnimeCatalog(dataKeys);

    const updatePage = useUpdatePage(dataKeys);
    const nextPage = useNextPage({ fetchNextPage, pagination });

    if (isLoading && !isFetchingNextPage) {
        return <AnimeListSkeleton />;
    }

    if (list === undefined || list.length === 0) {
        return <FiltersNotFound />;
    }

    return (
        <Block>
            <Stack extended={true} size={5} extendedSize={5}>
                {list.map((anime: API.Anime) => {
                    return <AnimeCard key={anime.slug} anime={anime} />;
                })}
            </Stack>
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={nextPage}
                />
            )}
            {list && pagination && pagination.pages > 1 && (
                <div className="sticky bottom-2 z-10 flex items-center justify-center">
                    <Card className="flex-row gap-2 p-2 bg-background/60 backdrop-blur-xl border-none">
                        <Pagination
                            page={Number(iPage)}
                            pages={pagination.pages}
                            setPage={updatePage}
                        />
                    </Card>
                </div>
            )}
        </Block>
    );
};

export default AnimeList;
