import { type FC, Fragment } from 'react';

import {
    followingHistoryInfiniteOptions,
    userHistoryInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import {
    HistoryTimeline,
    HistoryTimelineSkeleton,
} from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import { DEFAULT_PAGE_SIZE } from '../queries';

type Props = {
    source: 'user' | 'following';
};

const HistoryFeed: FC<Props> = ({ source }) => {
    const params = useParams();
    const isFollowing = source === 'following';
    const {
        list,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        isPending,
        ref,
    } = useInfiniteList(
        isFollowing
            ? followingHistoryInfiniteOptions()
            : userHistoryInfiniteOptions({
                  path: { username: String(params.username) },
              }),
    );

    return (
        <Fragment>
            {isPending && (
                <HistoryTimelineSkeleton
                    variant="page"
                    count={DEFAULT_PAGE_SIZE}
                />
            )}
            {list && list.length > 0 && (
                <HistoryTimeline
                    items={list}
                    variant="page"
                    withUser={isFollowing}
                />
            )}
            {list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsHistoryRounded />}
                    title="Історія відсутня"
                    description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                />
            )}
            {list && hasNextPage && (
                <LoadMoreButton
                    ref={ref}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            )}
        </Fragment>
    );
};

export default HistoryFeed;
