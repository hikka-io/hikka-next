'use client';

import { useParams } from 'next/navigation';
import { FC, Fragment } from 'react';

import HistoryItem from '../../../components/history-item';
import LoadMoreButton from '../../../components/load-more-button';
import { Badge } from '../../../components/ui/badge';
import Card from '../../../components/ui/card';
import NotFound from '../../../components/ui/not-found';
import Stack from '../../../components/ui/stack';
import useUserHistory from '../../../services/hooks/history/use-user-history';

interface Props {
    className?: string;
}

const History: FC<Props> = ({ className }) => {
    const params = useParams();
    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useUserHistory({
            username: String(params.username),
        });

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
                            className="absolute -top-3 left-4 z-[1]"
                        >
                            #{index + 1}
                        </Badge>
                        <HistoryItem data={item} />
                    </Card>
                ))}
                {list?.length === 0 && (
                    <NotFound
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

export default History;
