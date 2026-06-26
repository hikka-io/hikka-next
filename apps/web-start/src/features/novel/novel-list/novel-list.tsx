import type { ComponentProps, FC } from 'react';

import NovelCard from '@/components/content-card/novel-card';
import type { StackSize } from '@/components/ui/stack';
import CatalogListView from '@/features/catalog/catalog-list-view';

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
        queryKey,
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
            removeQueryKey={queryKey}
            extendedSize={extendedSize}
            renderItem={(novel) => (
                <NovelCard
                    key={novel.slug}
                    novel={
                        novel as unknown as ComponentProps<
                            typeof NovelCard
                        >['novel']
                    }
                />
            )}
        />
    );
};

export default NovelList;
