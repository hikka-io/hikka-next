'use client';

import { useParams, useSearchParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import NotFound from '@/components/ui/not-found';

import useReadList from '@/services/hooks/read/use-read-list';
import { READ_STATUS } from '@/utils/constants';

import GridView from './grid-view';
import TableView from './table-view/table-view';

const List = () => {
    const searchParams = useSearchParams()!;
    const params = useParams();

    const readStatus = searchParams.get('status');
    const view = searchParams.get('view') || 'table';

    const media_type = searchParams.getAll('types');
    const status = searchParams.getAll('statuses');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const magazines = searchParams.getAll('magazines');

    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'read_score';

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useReadList({
            content_type: params.content_type as 'manga' | 'novel',
            username: String(params.username),
            read_status: String(readStatus) as API.ReadStatus,
            media_type,
            status,
            years,
            genres,
            magazines,
            sort: sort && order ? [`${sort}:${order}`] : undefined,
        });

    if (!list || !readStatus) {
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
                                    READ_STATUS[readStatus as API.ReadStatus]
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
