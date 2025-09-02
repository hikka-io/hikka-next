'use client';

import { useUserFollowers, useUserFollowings } from '@hikka/react';
import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';

import FollowUserItem from './follow-user-item';

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
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {list.map((user) => {
                return <FollowUserItem key={user.reference} user={user} />;
            })}
            {hasNextPage && (
                <div className="px-6">
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                </div>
            )}
        </div>
    );
};

export default FollowlistModal;
