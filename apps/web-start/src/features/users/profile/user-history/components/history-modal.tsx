import type { ComponentProps } from 'react';

import { userHistoryInfiniteOptions } from '@hikka/api';

import { HistoryItem } from '@/components/content-card';
import LoadMoreButton from '@/components/load-more-button';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

type Props = {
    className?: string;
};

const HistoryModal = ({ className }: Props) => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useInfiniteList(
            userHistoryInfiniteOptions({
                path: { username: String(params.username) },
            }),
        );

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list?.map((item) => (
                <HistoryItem
                    data={
                        // TODO(phase2): drop cast once content-card is on @hikka/api
                        item as unknown as ComponentProps<
                            typeof HistoryItem
                        >['data']
                    }
                    key={item.reference}
                />
            ))}
            {hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default HistoryModal;
