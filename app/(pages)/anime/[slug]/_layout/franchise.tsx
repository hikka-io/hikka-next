'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import AnimeCard from '@/app/_components/anime-card';
import SubHeader from '@/app/_components/sub-header';
import getAnimeFranchise, {
    Response as AnimeFranchiseResponse,
} from '@/utils/api/anime/getAnimeFranchise';
import { Response as AnimeInfoResponse } from '@/utils/api/anime/getAnimeInfo';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { Button } from '@/app/_components/ui/button';
import { useSettingsContext } from '@/utils/providers/settings-provider';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const { ref, inView } = useInView();
    const params = useParams();
    const queryClient = useQueryClient();
    const anime: AnimeInfoResponse | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);

    if (!anime || !anime.has_franchise) {
        return null;
    }

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery({
            initialPageParam: 1,
            queryKey: ['franchise', params.slug, secret],
            getNextPageParam: (lastPage: AnimeFranchiseResponse, allPages) => {
                const nextPage = lastPage.pagination.page + 1;
                return nextPage > lastPage.pagination.pages
                    ? undefined
                    : nextPage;
            },
            queryFn: ({ pageParam = 1 }) =>
                getAnimeFranchise({
                    slug: String(params.slug),
                    page: pageParam,
                    secret: String(secret),
                })
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

    const filterSelfData = list.filter((anime) => anime.slug !== params.slug);
    const filteredData = extended ? filterSelfData : filterSelfData.slice(0, 4);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title={`Пов’язане`}
                href={!extended ? params.slug + '/franchise' : undefined}
            />
            <div
                className={clsx(
                    'grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8',
                    extended && 'md:grid-cols-5',
                )}
            >
                {filteredData.map((anime) => (
                    <AnimeCard
                        key={anime.slug}
                        watch={
                            anime.watch.length > 0 ? anime.watch[0] : undefined
                        }
                        slug={anime.slug}
                        href={`/anime/${anime.slug}`}
                        poster={anime.poster}
                        title={
                            anime[titleLanguage!] || anime.title_ua || anime.title_en || anime.title_ja
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
    );
};

export default Component;
