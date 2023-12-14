'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import MaterialSymbolsArrowRightAltRounded from '~icons/material-symbols/arrow-right-alt-rounded';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import AnimeCard from '@/app/_components/AnimeCard';
import NotFound from '@/app/_components/NotFound';
import { Response } from '@/utils/api/anime/getAnimeCharacters';
import getFavouriteList, {
    Response as FavouriteListResponse,
} from '@/utils/api/favourite/getFavouriteList';
import { WATCH_STATUS } from '@/utils/constants';
import { useAuthContext } from '@/utils/providers/AuthProvider';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { secret } = useAuthContext();
    const { ref, inView } = useInView();
    const params = useParams();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ['favorites', params.username, secret],
            getNextPageParam: (lastPage: FavouriteListResponse, allPages) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages
                    ? undefined
                    : nextPage;
            },
            queryFn: ({ pageParam = 1 }) =>
                getFavouriteList({
                    username: String(params.username),
                    page: pageParam,
                    secret: String(secret),
                }),
            staleTime: 0,
        });

    useEffect(() => {
        if (inView && data) {
            fetchNextPage();
        }
    }, [inView]);

    if (!data || !data.pages) {
        return null;
    }

    const list = data.pages.map((data) => data.list).flat(1);

    if (list.length === 0 && !extended) {
        return null;
    }

    const filteredData = extended ? list : list.slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h3>Улюблені</h3>
                {!extended && (
                    <Link
                        href={'/u/' + params.username + '/favorites'}
                        className="btn-badge btn btn-square btn-ghost"
                    >
                        <MaterialSymbolsArrowRightAltRounded className="text-2xl" />
                    </Link>
                )}
            </div>
            {filteredData.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                    {filteredData.map((res) => (
                        <AnimeCard
                            key={res.reference}
                            watch={
                                res.anime.watch.length > 0
                                    ? res.anime.watch[0]
                                    : undefined
                            }
                            title={
                                res.anime.title_ua ||
                                res.anime.title_en ||
                                res.anime.title_ja
                            }
                            poster={res.anime.poster}
                            href={'/anime/' + res.anime.slug}
                            slug={res.anime.slug}
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">Улюблені</span> пусто
                        </span>
                    }
                    description="Цей список оновиться після як сюди буде додано аніме"
                />
            )}
            {extended && hasNextPage && (
                <button
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                    className="btn btn-secondary"
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </button>
            )}
        </div>
    );
};

export default Component;
