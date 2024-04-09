'use client';

import * as React from 'react';

import { ReadonlyURLSearchParams } from 'next/navigation';

import AnimeListSkeleton from '@/app/(pages)/anime/(animeList)/components/anime-list/components/anime-list-skeleton';
import EntryCard from '@/components/entry-card/entry-card';
import FiltersNotFound from '@/components/filters/components/filters-not-found';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/pagination';
import useAnimeCatalog from '@/services/hooks/anime/useAnimeCatalog';
import useAuth from '@/services/hooks/auth/useAuth';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { MEDIA_TYPE } from '@/utils/constants';

import { useNextPage, useUpdatePage } from './anime-list.hooks';

interface Props {
    searchParams: Record<string, string>;
}

const AnimeList = ({ searchParams }: Props) => {
    const { titleLanguage } = useSettingsContext();
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
        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                {list.map((anime: API.Anime) => {
                    return (
                        <EntryCard
                            href={`/anime/${anime.slug}`}
                            poster={anime.poster}
                            title={
                                anime[titleLanguage!] ||
                                anime.title_ua ||
                                anime.title_en ||
                                anime.title_ja
                            }
                            key={anime.slug}
                            slug={anime.slug}
                            withContextMenu
                            content_type="anime"
                            leftSubtitle={
                                anime.year ? String(anime.year) : undefined
                            }
                            rightSubtitle={
                                anime.media_type &&
                                MEDIA_TYPE[anime.media_type].title_ua
                            }
                            watch={
                                anime.watch.length > 0
                                    ? anime.watch[0]
                                    : undefined
                            }
                        />
                    );
                })}
            </div>
            {hasNextPage && (
                <Button
                    variant="outline"
                    disabled={isFetchingNextPage}
                    onClick={nextPage}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Завантажити ще
                </Button>
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
        </div>
    );
};

export default AnimeList;
