import type { FC } from 'react';

import {
    ContentTypeEnum,
    type FavouriteAnimeResponse,
    favouriteListInfiniteOptions,
} from '@hikka/api';

import AnimeCard from '@/components/content-card/anime-card';
import MaterialSymbolsLiveTvRounded from '@/components/icons/material-symbols/MaterialSymbolsLiveTvRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { useParams } from '@/utils/navigation';

type Props = {
    extended?: boolean;
};

const Anime: FC<Props> = ({ extended }) => {
    const params = useParams();
    const {
        list: rawList,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        ref,
    } = useInfiniteList(
        favouriteListInfiniteOptions({
            path: {
                content_type: ContentTypeEnum.ANIME,
                username: String(params.username),
            },
        }),
    );

    const list = rawList as FavouriteAnimeResponse[] | undefined;

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
                            'grid-min-10 no-scrollbar -mx-4 auto-cols-scroll grid-flow-col grid-cols-scroll overflow-x-auto px-4',
                    )}
                >
                    {filteredData.map((res) => (
                        <AnimeCard
                            key={res.slug}
                            anime={res}
                            imagePreset="cardSm"
                        />
                    ))}
                </div>
            )}
            {filteredData.length === 0 && (
                <EmptyState
                    bordered
                    icon={<MaterialSymbolsLiveTvRounded />}
                    title={
                        <span>
                            У списку <span className="font-black">Аніме</span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того, як сюди буде додано аніме"
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
