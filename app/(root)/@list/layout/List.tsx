'use client';

import Card from '../components/Card';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import useDebounce from '@/utils/hooks/useDebounce';
import clsx from 'clsx';

const Component = () => {
    const searchParams = useSearchParams();
    const search = useDebounce({
        value:
            searchParams.has('search') && searchParams.get('search')!.length > 3
                ? searchParams.get('search')!
                : undefined,
        delay: 300,
    });
    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('lang');

    const { data, isLoading, error } = useQuery<
        { list: Hikka.Anime[]; pagination: Hikka.Pagination },
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
        ],
        queryFn: () =>
            getAnimeCatalog({
                query: search,
                years: years.length == 2 ? years : undefined,
                rating: ageRatings,
                season: seasons,
                status: statuses,
                media_type: types,
                genres
            }),
    });

    return (
        <section
            className={clsx('grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8')}
        >
            {!isLoading &&
                data &&
                data.list &&
                data!.list.map((x: Hikka.Anime) => {
                    return (
                        <Card
                            href="#"
                            poster={x.poster}
                            title_en={x.title_en}
                            key={x.slug}
                        />
                    );
                })}
            {error && <div>error</div>}
        </section>
    );
};

export default Component;
