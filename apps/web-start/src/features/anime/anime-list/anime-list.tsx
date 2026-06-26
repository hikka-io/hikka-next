import type { ComponentProps, FC } from 'react';

import AnimeCard from '@/components/content-card/anime-card';
import type { StackSize } from '@/components/ui/stack';
import CatalogListView from '@/features/catalog/catalog-list-view';

import { useAnimeSearchQuery } from './use-anime-search-query';

type Props = {
    extendedSize?: StackSize;
    pageSize?: number;
};

const AnimeList: FC<Props> = ({ extendedSize = 5, pageSize }) => {
    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
        queryKey,
    } = useAnimeSearchQuery(pageSize);

    return (
        <CatalogListView
            list={list}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            hasMultiplePages={Boolean(data && data.pages.length > 1)}
            pagination={pagination}
            removeQueryKey={queryKey}
            extendedSize={extendedSize}
            renderItem={(anime) => (
                <AnimeCard
                    key={anime.slug}
                    anime={
                        anime as unknown as ComponentProps<
                            typeof AnimeCard
                        >['anime']
                    }
                />
            )}
        />
    );
};

export default AnimeList;
