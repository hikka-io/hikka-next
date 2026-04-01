'use client';

import { useUserFollowers, useUserFollowings } from '@hikka/react';

import LoadMoreButton from '@/components/load-more-button';

import { useParams } from '@/utils/navigation';

import FollowUserItem from './components/follow-user-item';

interface Props {
    type: 'followers' | 'followings';
    username?: string;
}

const FollowlistModal = ({ type, username }: Props) => {
    const params = useParams();
    const resolvedUsername = username ?? String(params.username);

    const followersQuery = useUserFollowers({
        username: resolvedUsername,
        options: {
            enabled: type === 'followers',
        },
    });

    const followingsQuery = useUserFollowings({
        username: resolvedUsername,
        options: {
            enabled: type === 'followings',
        },
    });

    if (!followersQuery.data && !followingsQuery.data) {
        return null;
    }

    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        type === 'followers' ? followersQuery : followingsQuery;

    if (!list) {
        return null;
    }

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
            {list.map((user) => {
                return <FollowUserItem key={user.reference} user={user} />;
            })}
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
