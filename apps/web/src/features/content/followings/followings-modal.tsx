import type { FC } from 'react';

import type {
    MainContentTypeEnum,
    UserResponseWithRead,
    UserResponseWithWatch,
} from '@hikka/api';

import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
import InfiniteListSheet from '@/components/infinite-list-sheet';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import { contentFollowingOptions } from '../queries';
import FollowingItem from './components/following-item';
import FollowingItemSkeleton from './components/following-item-skeleton';

type Props = {
    content_type: MainContentTypeEnum;
};

const FollowingsModal: FC<Props> = ({ content_type }) => {
    const params = useParams();

    const {
        list,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        fetchNextPage,
        ref,
    } = useInfiniteList(
        contentFollowingOptions(content_type, String(params.slug)),
    );

    return (
        <InfiniteListSheet<UserResponseWithWatch | UserResponseWithRead>
            className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4"
            list={list}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            loadMoreRef={ref}
            skeleton={FollowingItemSkeleton}
            renderItem={(item) => (
                <FollowingItem
                    data={{
                        type: 'watch' in item ? 'watch' : 'read',
                        content: 'watch' in item ? item.watch : item.read,
                        ...item,
                    }}
                    key={item.reference}
                />
            )}
            emptyState={
                <EmptyState
                    icon={<MaterialSymbolsPerson2OutlineRounded />}
                    title="Тут поки порожньо"
                    description="Ніхто з користувачів, за якими ви стежите, ще не додав цей тайтл до списку"
                />
            }
        />
    );
};

export default FollowingsModal;
