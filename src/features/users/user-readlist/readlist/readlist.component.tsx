'use client';

import { useParams, useSearchParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import Block from '@/components/ui/block';
import NotFound from '@/components/ui/not-found';

import { READ_STATUS } from '@/utils/constants/common';

import { useList } from '../readlist.hooks';
import GridView from './grid-view';
import TableView from './table-view/table-view';

const List = () => {
    const searchParams = useSearchParams()!;
    const params = useParams();

    const readStatus = searchParams.get('status');
    const view = searchParams.get('view') || 'table';

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useList();

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
                    description={`Цей список оновиться після того як сюди буде додано ${params.content_type === 'manga' ? 'манґу' : 'ранобе'} з цим статусом`}
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
