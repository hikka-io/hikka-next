'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';



import { useParams } from 'next/navigation';



import { useInfiniteQuery } from '@tanstack/react-query';



import AnimeCard from '@/app/_components/anime-card';
import BaseCard from '@/app/_components/base-card';
import SubHeader from '@/app/_components/sub-header';
import getCharacterAnime, {
    Response,
} from '@/utils/api/characters/getCharacterAnime';
import { Button } from '@/app/_components/ui/button';
import { useSettingsContext } from '@/utils/providers/settings-provider';


interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const { ref, inView } = useInView();
    const params = useParams();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ['characterAnime', params.slug],
            getNextPageParam: (lastPage: Response, allPages) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages
                    ? undefined
                    : nextPage;
            },
            queryFn: ({ pageParam = 1 }) =>
                getCharacterAnime({
                    slug: String(params.slug),
                    page: pageParam,
                }),
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

    if (!list || list.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-8">
                <SubHeader
                    title={'Аніме'}
                    href={!extended ? params.slug + '/anime' : undefined}
                />
                <div
                    className={clsx(
                        'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                    )}
                >
                    {(extended ? list : list.slice(0, 5)).map((ch) => (
                        <AnimeCard
                            slug={ch.anime.slug}
                            key={ch.anime.slug}
                            href={`/anime/${ch.anime.slug}`}
                            poster={ch.anime.poster}
                            title={
                                ch.anime[titleLanguage!] ||
                                ch.anime.title_ua ||
                                ch.anime.title_ua ||
                                ch.anime.title_ja
                            }
                            posterClassName="!h-[calc(100%+2rem)] absolute -top-1 left-0"
                        />
                    ))}
                </div>
                {extended && hasNextPage && (
                    <Button
                        variant="secondary"
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
        </div>
    );
};

export default Component;