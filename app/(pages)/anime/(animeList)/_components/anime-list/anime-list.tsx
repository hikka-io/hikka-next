'use client';

import * as React from 'react';

import { useSearchParams } from 'next/navigation';

import AnimeCard from '@/components/anime-card';
import FiltersNotFound from '@/components/filters/_components/filters-not-found';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/ui/pagination';
import useAnimeCatalog from '@/services/hooks/anime/useAnimeCatalog';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { MEDIA_TYPE } from '@/utils/constants';

import AnimeListSkeleton from './_components/anime-list-skeleton';
import { useNextPage, useUpdatePage } from './anime-list.hooks';


const Component = () => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const searchParams = useSearchParams();

    const page = searchParams.get('page');
    const iPage = searchParams.get('iPage');

    const dataKeys = {
        page: Number(page),
        iPage: Number(iPage),
        secret,
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
                {list.map((x: API.Anime) => {
                    return (
                        <AnimeCard
                            href={`/anime/${x.slug}`}
                            poster={x.poster}
                            title={
                                x[titleLanguage!] ||
                                x.title_ua ||
                                x.title_en ||
                                x.title_ja
                            }
                            key={x.slug}
                            slug={x.slug}
                            leftSubtitle={x.year ? String(x.year) : undefined}
                            rightSubtitle={
                                x.media_type &&
                                MEDIA_TYPE[x.media_type].title_ua
                            }
                            watch={x.watch.length > 0 ? x.watch[0] : undefined}
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
                <div className="sticky z-10 bottom-2 flex items-center justify-center">
                    <div className="bg-background border p-2 border-secondary/60 rounded-lg shadow w-fit">
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

export default Component;
