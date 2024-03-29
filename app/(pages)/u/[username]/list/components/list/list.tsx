'use client';

import { useParams, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import { WATCH_STATUS } from '@/utils/constants';

import GridView from '@/app/(pages)/u/[username]/list/components/list/components/grid-view';
import TableView from '@/app/(pages)/u/[username]/list/components/list/components/table-view';
import useWatchList from '@/services/hooks/watch/useWatchList';

interface Props {}

const Component = ({}: Props) => {
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
        <div className="flex flex-col gap-8">
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
                                    WATCH_STATUS[
                                        watchStatus as API.WatchStatus
                                    ].title_ua
                                }
                            </span>{' '}
                            пусто
                        </span>
                    }
                    description="Цей список оновиться після як сюди буде додано аніме з цим статусом"
                />
            )}
            {hasNextPage && (
                <Button
                    variant="outline"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Завантажити ще
                </Button>
            )}
        </div>
    );
};

export default Component;
