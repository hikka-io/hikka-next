'use client';

import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import type { StackSize } from '@/components/ui/stack';

import { CatalogSummary } from '@/features/content';
import { useCatalogView } from '@/features/filters/hooks/use-catalog-view';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import GridView from './components/grid-view';
import RecordsNotFound from './components/records-not-found';
import TableView from './components/table-view';
import { useReadList } from './hooks/use-readlist';
import { useWatchList } from './hooks/use-watchlist';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
    extendedSize?: StackSize;
}

const List: FC<Props> = ({ content_type, extendedSize }) => {
    const search = useFilterSearch<{ status?: string }>();
    const { view } = useCatalogView('userlist');
    const isAnime = content_type === ContentTypeEnum.ANIME;

    const status = search.status as ReadStatusEnum | WatchStatusEnum | 'all';

    const watchList = useWatchList({ enabled: isAnime });
    const readList = useReadList({ enabled: !isAnime });
    const {
        list,
        pagination,
        isLoading,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        ref,
    } = isAnime ? watchList : readList;

    if (!list || !status) {
        return null;
    }

    return (
        <div className="flex flex-col gap-6">
            <CatalogSummary total={pagination?.total} isLoading={isLoading} />
            {list.length > 0 ? (
                view === 'table' ? (
                    <TableView data={list} content_type={content_type} />
                ) : (
                    <GridView
                        data={list}
                        content_type={content_type}
                        extendedSize={extendedSize}
                    />
                )
            ) : (
                <RecordsNotFound status={status} content_type={content_type} />
            )}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default List;
