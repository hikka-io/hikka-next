'use client';

import Search from '../components/Search';
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
            (searchParams.has('search') && searchParams.get('search')!.length > 3)
                ? searchParams.get('search')!
                : undefined,
        delay: 300,
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ['list', search],
        queryFn: () => getAnimeCatalog({ query: search }),
    });

    return (
        <div className="flex flex-col gap-8">
            <Search />
            <section
                className={clsx(
                    'grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8',
                )}
            >
                {!isLoading &&
                    data &&
                    data.list &&
                    data!.list.map((x: any) => {
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
        </div>
    );
};

export default Component;
