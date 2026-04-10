'use client';

import { FC } from 'react';

import { CatalogSummary } from '@/features/content';

import { useAnimeSearchQuery } from '@/features/anime/anime-list/use-anime-search-query';

/**
 * Thin anime-specific wrapper around the generic CatalogSummary.
 * Reads pagination from the shared anime search query.
 */
const AnimeListSummary: FC = () => {
    const { pagination, isLoading } = useAnimeSearchQuery();

    return <CatalogSummary total={pagination?.total} isLoading={isLoading} />;
};

export default AnimeListSummary;
