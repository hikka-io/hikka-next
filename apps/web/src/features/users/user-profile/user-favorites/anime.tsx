'use client';

import { ContentTypeEnum, FavouriteAnimeResponse } from '@hikka/client';
import { useFavouriteList } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import AnimeCard from '@/components/anime-card';
import LoadMoreButton from '@/components/load-more-button';
import NotFound from '@/components/ui/not-found';

import { cn } from '@/utils/utils';

interface Props {
    extended?: boolean;
}

const Anime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useFavouriteList<FavouriteAnimeResponse>({
        contentType: ContentTypeEnum.ANIME,
        username: String(params.username),
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
                        <AnimeCard key={res.slug} anime={res} />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <NotFound
                    title={
                        <span>
                            У списку <span className="font-black">Аніме</span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано аніме"
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

export default Anime;
