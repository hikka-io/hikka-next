'use client';

import * as React from 'react';

import AnimeCard from '@/app/(pages)/(content)/components/anime-card';
import FiltersNotFound from '@/components/filters/components/filters-not-found';
import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import Pagination from '@/components/ui/pagination';
import Stack from '@/components/ui/stack';
import useAnimeCatalog from '@/services/hooks/anime/useAnimeCatalog';
import useAuth from '@/services/hooks/auth/useAuth';

import { useNextPage, useUpdatePage } from './anime-list.hooks';
import AnimeListSkeleton from './components/anime-list-skeleton';

interface Props {
    searchParams: Record<string, string>;
}

const AnimeList = ({ searchParams }: Props) => {
    const { auth } = useAuth();

    const page = searchParams.page;
    const iPage = searchParams.iPage;

    const dataKeys = {
        page: Number(page),
        iPage: Number(iPage),
        auth,
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
                    <div className="w-fit rounded-lg border border-secondary/60 bg-background p-2 shadow">
                        <Pagination
                            page={Number(iPage)}
                            pages={pagination.pages}
                            setPage={updatePage}
                        />
                    </div>
                </div>
            )}
        </Block>
    );
};

export default AnimeList;
