'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import AnimeCard from '@/app/_components/anime-card';
import NotFound from '@/app/_components/ui/not-found';
import SubHeader from '@/app/_components/sub-header';
import { Button } from '@/app/_components/ui/button';
import getFavouriteList from '@/app/_utils/api/favourite/getFavouriteList';
import useInfiniteList from '@/app/_utils/hooks/useInfiniteList';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';
import { useSettingsContext } from '@/app/_utils/providers/settings-provider';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const { ref, inView } = useInView();
    const params = useParams();
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteList({
            queryKey: ['favorites', params.username, secret],
            queryFn: ({ pageParam = 1 }) =>
                getFavouriteList({
                    username: String(params.username),
                    page: pageParam,
                    secret: String(secret),
                }),
        });

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    if ((!list || list.length === 0) && !extended) {
        return null;
    }

    const filteredData = (extended ? list : list?.slice(0, 5)) || [];

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Улюблені"
                href={
                    !extended
                        ? '/u/' + params.username + '/favorites'
                        : undefined
                }
            />
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
                                res.anime[titleLanguage!] ||
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
                <Button
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </Button>
            )}
        </div>
    );
};

export default Component;