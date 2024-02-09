'use client';

import { useEffect, useState } from 'react';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

import { useWatchList } from '@/app/(pages)/u/[username]/page.hooks';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/ui/not-found';
import { WATCH_STATUS } from '@/utils/constants';

import GridView from './_components/grid-view';
import TableView from './_components/table-view';

interface Props {}

const Component = ({}: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()!;
    const params = useParams();

    const watchStatus = searchParams.get('status');
    const order = searchParams.get('order');
    const sort = searchParams.get('sort');
    const view = searchParams.get('view') || 'table'

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useWatchList({
            username: String(params.username),
            status: String(watchStatus),
            order: String(order),
            sort: String(sort),
        });

    useEffect(() => {
        if (!watchStatus) {
            router.replace(
                pathname + '/?status=completed&order=score&sort=desc',
            );
        } else if (!order || !sort) {
            router.replace(
                pathname + '/?status=' + watchStatus + '&order=score&sort=desc',
            );
        }
    }, [watchStatus]);

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
                                        watchStatus as Hikka.WatchStatus
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
                    variant="secondary"
                    ref={ref}
                    disabled={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    {isFetchingNextPage && (
                        <span className="loading loading-spinner"></span>
                    )}
                    Заванатажити ще
                </Button>
            )}
        </div>
    );
};

export default Component;