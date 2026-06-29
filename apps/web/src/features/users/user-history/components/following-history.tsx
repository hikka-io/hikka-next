import { type FC, Fragment } from 'react';

import { followingHistoryInfiniteOptions } from '@hikka/api';

import { HistoryItem } from '@/components/content-card';
import MaterialSymbolsHistoryRounded from '@/components/icons/material-symbols/MaterialSymbolsHistoryRounded';
import LoadMoreButton from '@/components/load-more-button';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import Stack from '@/components/ui/stack';
import { useInfiniteList } from '@/utils/api/use-infinite-list';

type Props = {
    className?: string;
};

const FollowingHistory: FC<Props> = ({ className }) => {
    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useInfiniteList(followingHistoryInfiniteOptions());

    return (
        <Fragment>
            <Stack
                size={3}
                extended
                extendedSize={3}
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
                {list?.map((item, index) => (
                    <Card key={item.reference}>
                        <Badge
                            variant="secondary"
                            className="absolute -top-3 left-4 z-1"
                        >
                            #{index + 1}
                        </Badge>
                        <HistoryItem data={item} withUser className="flex-1" />
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

export default FollowingHistory;
