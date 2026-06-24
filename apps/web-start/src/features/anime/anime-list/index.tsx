'use client';

import type { FC } from 'react';

import { queryKeys } from '@hikka/react/core';

import AnimeCard from '@/components/content-card/anime-card';
import type { StackSize } from '@/components/ui/stack';
import CatalogListView from '@/features/content/catalog-list-view';

import { useAnimeSearchQuery } from './use-anime-search-query';

type Props = {
    extendedSize?: StackSize;
    pageSize?: number;
};

const AnimeList: FC<Props> = ({ extendedSize = 5, pageSize }) => {
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
    } = useAnimeSearchQuery(pageSize);

    return (
        <CatalogListView
            list={list}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            hasMultiplePages={Boolean(data && data.pages.length > 1)}
            pagination={pagination}
            removeQueryKey={queryKeys.anime.search({ args, paginationArgs })}
            extendedSize={extendedSize}
            renderItem={(anime) => <AnimeCard key={anime.slug} anime={anime} />}
        />
    );
};

export default AnimeList;
