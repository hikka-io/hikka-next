'use client';

import { useParams, useSearchParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import NotFound from '@/components/ui/not-found';

import useWatchList from '@/services/hooks/watch/use-watch-list';
import { WATCH_STATUS } from '@/utils/constants';

import GridView from './grid-view';
import TableView from './table-view/table-view';

const List = () => {
    const searchParams = useSearchParams()!;
    const params = useParams();

    const watchStatus = searchParams.get('status');
    const view = searchParams.get('view') || 'table';

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useWatchList({
            username: String(params.username),
            watch_status: String(watchStatus) as API.WatchStatus,
        });

    if (!list || !watchStatus) {
        return null;
    }

    return (
        <Block>
            {list.length > 0 ? (
                view === 'table' ? (
                    <TableView data={list} />
                ) : (
                    <GridView data={list} />
                )
            ) : (
                <NotFound
                    title={
                        <span>
                            У списку{' '}
                            <span className="font-black">
                                {
                                    WATCH_STATUS[watchStatus as API.WatchStatus]
                                        .title_ua
                                }
                            </span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після того як сюди буде додано аніме з цим статусом"
                />
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
