'use client';

import { useUserFollowers, useUserFollowings } from '@hikka/react';

import LoadMoreButton from '@/components/load-more-button';

import { useParams } from '@/utils/navigation';

import FollowUserItem from './components/follow-user-item';

interface Props {
    type: 'followers' | 'followings';
}

const FollowlistModal = ({ type }: Props) => {
    const params = useParams();

    const followersQuery = useUserFollowers({
        username: String(params.username),
        options: {
            enabled: type === 'followers',
        },
    });

    const followingsQuery = useUserFollowings({
        username: String(params.username),
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
        <div className="-mx-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
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
