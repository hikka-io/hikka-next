import { type FC, Fragment } from 'react';

import { range } from '@antfu/utils';

import {
    followingHistoryInfiniteOptions,
    userHistoryInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import { HistoryItem, HistoryItemSkeleton } from '@/components/list-items';
import LoadMoreButton from '@/components/load-more-button';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

const SKELETON_COUNT = 15;

type Props = {
    source: 'user' | 'following';
};

const HistoryGrid: FC<Props> = ({ source }) => {
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
            <Stack
                size={3}
                extended
                extendedSize={3}
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
                {isPending &&
                    range(0, SKELETON_COUNT).map((index) => (
                        <Card key={index}>
                            <HistoryItemSkeleton withUser={isFollowing} />
                        </Card>
                    ))}
                {list?.map((item, index) => (
                    <Card key={item.reference}>
                        <Badge
                            variant="secondary"
                            className="absolute -top-3 left-4 z-1"
                        >
                            #{index + 1}
                        </Badge>
                        {isFollowing ? (
                            <HistoryItem
                                data={item}
                                withUser
                                className="flex-1"
                            />
                        ) : (
                            <HistoryItem data={item} />
                        )}
                    </Card>
                ))}
                {list?.length === 0 && (
                    <EmptyState
                        icon={<MaterialSymbolsHistoryRounded />}
                        title="Історія відсутня"
                        description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                    />
                )}
            </Stack>
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

export default HistoryGrid;
