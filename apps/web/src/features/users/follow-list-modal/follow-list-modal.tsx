import { range } from '@antfu/utils';

import {
    followersListInfiniteOptions,
    followingListInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import FollowUserItem from './components/follow-user-item';
import FollowUserItemSkeleton from './components/follow-user-item-skeleton';

const SKELETON_COUNT = 5;

type Props = {
    type: 'followers' | 'followings';
    username?: string;
};

const FollowlistModal = ({ type, username }: Props) => {
    const params = useParams();
    const resolvedUsername = username ?? String(params.username);

    const followersQuery = useInfiniteList(
        followersListInfiniteOptions({
            path: { username: resolvedUsername },
        }),
        { enabled: type === 'followers' },
    );

    const followingsQuery = useInfiniteList(
        followingListInfiniteOptions({
            path: { username: resolvedUsername },
        }),
        { enabled: type === 'followings' },
    );

    const {
        list,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        ref,
    } = type === 'followers' ? followersQuery : followingsQuery;

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {isLoading &&
                range(0, SKELETON_COUNT).map((index) => (
                    <FollowUserItemSkeleton key={index} />
                ))}
            {list?.map((user) => {
                return <FollowUserItem key={user.reference} user={user} />;
            })}
            {!isLoading && list?.length === 0 && (
                <EmptyState
                    icon={<MaterialSymbolsPerson2OutlineRounded />}
                    title={
                        type === 'followers'
                            ? 'Ще ніхто не стежить'
                            : 'Ще ні за ким не стежить'
                    }
                    description={
                        type === 'followers'
                            ? 'Тут з’являться користувачі, які стежать за цим профілем'
                            : 'Тут з’являться користувачі, за якими стежить цей профіль'
                    }
                />
            )}
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

export default FollowlistModal;
