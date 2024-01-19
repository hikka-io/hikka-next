'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';



import { usePathname, useSearchParams } from 'next/navigation';



import { useQuery } from '@tanstack/react-query';



import AnimeCard from '@/app/_components/anime-card';
import NotFound from '@/app/_components/not-found';
import Pagination from '@/app/_components/pagination';
import SkeletonCard from '@/app/_components/skeletons/entry-card';
import { Button } from '@/app/_components/ui/button';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import useDebounce from '@/utils/hooks/useDebounce';
import { useAuthContext } from '@/utils/providers/auth-provider';
import useRouter from '@/utils/useRouter';
import { useSettingsContext } from '@/utils/providers/settings-provider';


const Component = () => {
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

    const [selectedPage, setSelectedPage] = useState(page ? Number(page) : 1);
    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('only_translated');
    const sort = searchParams.get('sort');

    const { data, isLoading, error } = useQuery<
        {
            list: Hikka.Anime[];
            pagination: Hikka.Pagination;
        },
        Error
    >({
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
            selectedPage,
            secret,
            sort,
        ],
        queryFn: () =>
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
                page: selectedPage,
                secret: String(secret),
                size: 20,
            }),
    });

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams);

            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    const range = (min: number, max: number) => {
        const newArr = [];

        for (let i = min; i <= max; i++) {
            newArr.push(i);
        }

        return newArr;
    };

    useEffect(() => {
        const query = createQueryString('page', String(selectedPage));
        router.push(`${pathname}?${query}`, { scroll: true });
    }, [selectedPage]);

    useEffect(() => {
        if (page) {
            setSelectedPage(Number(page));
        }
    }, [page]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [searchParams]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                {range(1, 20).map((v) => (
                    <SkeletonCard key={v} />
                ))}
            </div>
        );
    }

    if (data === undefined || !data?.list || data.list.length === 0) {
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
                {data &&
                    data.list &&
                    data!.list.map((x: Hikka.Anime) => {
                        return (
                            <AnimeCard
                                href={`/anime/${x.slug}`}
                                poster={x.poster}
                                title={x[titleLanguage!] || x.title_ua || x.title_en || x.title_ja}
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
            {data && data.pagination && data.pagination.pages > 1 && (
                <Pagination
                    page={selectedPage}
                    pages={data.pagination.pages}
                    setPage={setSelectedPage}
                />
            )}
        </div>
    );
};

export default Component;