'use client';

import {
    ContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
import { useSearchParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';

import { useSettingsStore } from '@/services/stores/settings-store';

import GridView from './components/grid-view';
import RecordsNotFound from './components/records-not-found';
import TableView from './components/table-view/table-view';
import { useReadList } from './hooks/use-readlist';
import { useWatchList } from './hooks/use-watchlist';

interface Props {
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const List = ({ content_type }: Props) => {
    const searchParams = useSearchParams()!;
    const { preferences } = useSettingsStore();

    const status = searchParams.get('status') as
        | ReadStatusEnum
        | WatchStatusEnum;
    const view = preferences.views.userlist || 'table';

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        content_type === ContentTypeEnum.ANIME ? useWatchList() : useReadList();

    if (!list || !status) {
        return null;
    }

    return (
        <Block>
            {list.length > 0 ? (
                view === 'table' ? (
                    <TableView data={list} content_type={content_type} />
                ) : (
                    <GridView data={list} content_type={content_type} />
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
        </Block>
    );
};

export default List;
