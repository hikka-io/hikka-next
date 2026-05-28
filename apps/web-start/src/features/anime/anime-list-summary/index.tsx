'use client';

import { FC } from 'react';

import { CatalogSummary } from '@/features/content';

import { useAnimeSearchQuery } from '@/features/anime/anime-list/use-anime-search-query';

interface Props {
    pageSize?: number;
}

const AnimeListSummary: FC<Props> = ({ pageSize }) => {
    const { pagination, isLoading } = useAnimeSearchQuery(pageSize);

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default AnimeListSummary;
