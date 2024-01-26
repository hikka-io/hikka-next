'use client';

import clsx from 'clsx';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import { usePathname, useSearchParams } from 'next/navigation';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import AnimeCard from '@/app/_components/anime-card';
import NotFound from '@/app/_components/not-found';
import Pagination from '@/app/_components/ui/pagination';
import SkeletonCard from '@/app/_components/skeletons/entry-card';
import { Button } from '@/app/_components/ui/button';
import getAnimeCatalog, {
    Response as AnimeCatalogResponse,
} from '@/utils/api/anime/getAnimeCatalog';
import createQueryString from '@/utils/createQueryString';
import useDebounce from '@/utils/hooks/useDebounce';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useSettingsContext } from '@/utils/providers/settings-provider';
import useRouter from '@/utils/useRouter';
import NProgress from 'nprogress';

const Component = () => {
    const queryClient = useQueryClient();
    const { ref, inView } = useInView();
    const { titleLanguage } = useSettingsContext();
    const { secret } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = useDebounce({
        value:
            searchParams.has('search') && searchParams.get('search')!.length > 3
                ? searchParams.get('search')!
                : undefined,
        delay: 300,
    });

    const page = searchParams.get('page');
    const iPage = searchParams.get('iPage');

    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('only_translated');
    const sort = searchParams.get('sort');


    const {
        data,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<AnimeCatalogResponse, Error>({
        queryKey: [
            'list',
            search,
            types,
            statuses,
            seasons,
            ageRatings,
            years,
            lang,
            genres,
            secret,
            sort,
            page,
        ],
        initialPageParam: iPage || page,
        getNextPageParam: (lastPage: AnimeCatalogResponse, allPages) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: ({ pageParam = page }) =>
            getAnimeCatalog({
                query: search,
                years: years.length == 2 ? years : undefined,
                rating: ageRatings,
                season: seasons,
                status: statuses,
                media_type: types,
                sort: sort ? ['score:' + sort] : ['score:desc'],
                genres,
                only_translated: Boolean(lang),
                page: pageParam as number,
                secret: String(secret),
                size: 20,
            }),
    });

    const range = (min: number, max: number) => {
        const newArr = [];

        for (let i = min; i <= max; i++) {
            newArr.push(i);
        }

        return newArr;
    };

    const updatePage = (newPage: number) => {
        if (newPage !== Number(page) || newPage !== Number(iPage)) {
            queryClient.removeQueries({
                queryKey: [
                    'list',
                    search,
                    types,
                    statuses,
                    seasons,
                    ageRatings,
                    years,
                    lang,
                    genres,
                    secret,
                    sort,
                    page,
                ],
            });
            const query = createQueryString(
                'iPage',
                String(newPage),
                createQueryString(
                    'page',
                    String(newPage),
                    new URLSearchParams(searchParams),
                ),
            );
            router.push(`${pathname}?${query.toString()}`, { scroll: true });
        }
    };

    useEffect(() => {
        if (inView && data) {
            const query = createQueryString(
                'iPage',
                String(data.pages[data.pages.length - 1].pagination.page + 1),
                new URLSearchParams(searchParams),
            );

            router.replace(`${pathname}?${query.toString()}`, {
                scroll: false,
            });

            fetchNextPage();
        }
    }, [inView]);

    if (isLoading && !isFetchingNextPage) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                {range(1, 20).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </div>
        );
    }

    const list = data && data.pages.map((data) => data.list).flat(1);

    if (list === undefined || list.length == 0) {
        return (
            <NotFound
                title="Не знайдено результатів за Вашим запитом"
                description="Очистіть або змініть фільтри, щоб отримати інший результат"
            >
                <Button
                    variant="destructive"
                    onClick={() => router.push(pathname)}
                    className="w-full lg:w-auto"
                >
                    <AntDesignClearOutlined />
                    Очистити
                </Button>
            </NotFound>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <section
                className={clsx(
                    'grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8',
                )}
            >
                {list &&
                    list.map((x: Hikka.Anime) => {
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
                                watch={
                                    x.watch.length > 0 ? x.watch[0] : undefined
                                }
                            />
                        );
                    })}
                {error && <div>error</div>}
            </section>
            {list &&
                data.pages[0].pagination &&
                data.pages[0].pagination.pages > 1 && (
                    <div className="sticky z-10 bottom-2 flex items-center justify-center">
                        <div className="bg-background border p-2 border-secondary/60 rounded-lg shadow w-fit">
                            <Pagination
                                page={Number(iPage)}
                                pages={data.pages[0].pagination.pages}
                                setPage={updatePage}
                            />
                        </div>
                    </div>
                )}
            {hasNextPage && (
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