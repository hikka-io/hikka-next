'use client';

import { FC } from 'react';

import { useAnimeSearchQuery } from '@/features/anime/anime-list/use-anime-search-query';
import { ActiveFilters } from '@/features/content';

/**
 * Summary row shown between the catalog toolbar and the list itself:
 * results count on the left, active filter chips inline next to it.
 */
const AnimeListSummary: FC = () => {
    const { pagination, isLoading } = useAnimeSearchQuery();
    const total = pagination?.total;

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="text-muted-foreground shrink-0 text-sm">
                {isLoading || total == null ? (
                    <span className="bg-secondary/40 inline-block h-4 w-40 animate-pulse rounded" />
                ) : (
                    <>
                        Знайдено{' '}
                        <span className="text-foreground font-semibold">
                            {total.toLocaleString('uk-UA')}
                        </span>{' '}
                        результатів
                    </>
                )}
            </div>
            <ActiveFilters />
        </div>
    );
};

export default AnimeListSummary;
