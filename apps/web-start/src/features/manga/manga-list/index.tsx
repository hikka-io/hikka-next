import type { FC } from 'react';

import { queryKeys } from '@hikka/react/core';

import MangaCard from '@/components/content-card/manga-card';
import type { StackSize } from '@/components/ui/stack';
import CatalogListView from '@/features/content/catalog-list-view';

import { useMangaSearchQuery } from './use-manga-search-query';

type Props = {
    extendedSize?: StackSize;
    pageSize?: number;
};

const MangaList: FC<Props> = ({ extendedSize = 5, pageSize }) => {
    const {
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        hasNextPage,
        data,
        list,
        pagination,
        args,
        paginationArgs,
    } = useMangaSearchQuery(pageSize);

    return (
        <CatalogListView
            list={list}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            hasMultiplePages={Boolean(data && data.pages.length > 1)}
            pagination={pagination}
            removeQueryKey={queryKeys.manga.search({ args, paginationArgs })}
            extendedSize={extendedSize}
            renderItem={(manga) => <MangaCard key={manga.slug} manga={manga} />}
        />
    );
};

export default MangaList;
