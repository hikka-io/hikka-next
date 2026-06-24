'use client';

import type { FC } from 'react';

import { queryKeys } from '@hikka/react/core';

import NovelCard from '@/components/content-card/novel-card';
import type { StackSize } from '@/components/ui/stack';
import CatalogListView from '@/features/content/catalog-list-view';

import { useNovelSearchQuery } from './use-novel-search-query';

type Props = {
    extendedSize?: StackSize;
    pageSize?: number;
};

const NovelList: FC<Props> = ({ extendedSize = 5, pageSize }) => {
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
    } = useNovelSearchQuery(pageSize);

    return (
        <CatalogListView
            list={list}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            hasMultiplePages={Boolean(data && data.pages.length > 1)}
            pagination={pagination}
            removeQueryKey={queryKeys.novel.search({ args, paginationArgs })}
            extendedSize={extendedSize}
            renderItem={(novel) => <NovelCard key={novel.slug} novel={novel} />}
        />
    );
};

export default NovelList;
