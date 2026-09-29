import type { FC } from 'react';

import {
    followersListInfiniteOptions,
    followingListInfiniteOptions,
} from '@hikka/api';

import MaterialSymbolsPerson2OutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsPerson2OutlineRounded';
import InfiniteListSheet from '@/components/infinite-list-sheet';
import EmptyState from '@/components/ui/empty-state';
import {
    ResponsiveModal,
    ResponsiveModalContent,
} from '@/components/ui/responsive-modal';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import FollowUserItem from './components/follow-user-item';
import FollowUserItemSkeleton from './components/follow-user-item-skeleton';

type BodyProps = {
    type: 'followers' | 'followings';
    username?: string;
};

type Props = BodyProps & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const FollowListModalBody: FC<BodyProps> = ({ type, username }) => {
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
        <InfiniteListSheet
            className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4"
            list={list}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            loadMoreRef={ref}
            skeleton={FollowUserItemSkeleton}
            renderItem={(user) => (
                <FollowUserItem key={user.reference} user={user} />
            )}
            emptyState={
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
            }
        />
    );
};

const FollowListModal: FC<Props> = ({ open, onOpenChange, type, username }) => (
    <ResponsiveModal open={open} onOpenChange={onOpenChange} type="sheet">
        <ResponsiveModalContent
            side="right"
            title={type === 'followers' ? 'Стежать' : 'Відстежується'}
        >
            <FollowListModalBody type={type} username={username} />
        </ResponsiveModalContent>
    </ResponsiveModal>
);

export default FollowListModal;
