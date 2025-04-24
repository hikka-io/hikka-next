'use client';

import { ContentTypeEnum, FavouriteMangaResponse } from '@hikka/client';
import { useFavouriteList } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import MangaCard from '@/components/manga-card';
import NotFound from '@/components/ui/not-found';

import { cn } from '@/utils/utils';

interface Props {
    extended?: boolean;
}

const Manga: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useFavouriteList<FavouriteMangaResponse>({
        contentType: ContentTypeEnum.MANGA,
        username: String(params.username),
        options: {
            enabled: !!params.username,
        },
    });

    if (isPending) {
        return null;
    }

    if (!list && !extended) {
        return null;
    }

    const filteredData = (extended ? list : list?.slice(0, 6)) || [];

    return (
        <>
            {filteredData.length > 0 && (
                <div
                    className={cn(
                        'grid grid-cols-2 gap-4 md:grid-cols-6 lg:gap-8',
                        !extended &&
                            'grid-min-10 no-scrollbar auto-cols-scroll grid-cols-scroll -mx-4 grid-flow-col overflow-x-auto px-4',
                    )}
                >
                    {filteredData.map((res) => (
                        <MangaCard key={res.slug} manga={res} />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку <span className="font-black">Манґа</span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано манґу"
                />
            )}
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </>
    );
};

export default Manga;
