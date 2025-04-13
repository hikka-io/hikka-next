'use client';

import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import getFollowers from '@/services/api/follow/getFollowers';
import getFollowings from '@/services/api/follow/getFollowings';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import FollowUserItem from './follow-user-item';

interface Props {
    type: 'followers' | 'followings';
}

const Component = ({ type }: Props) => {
    const params = useParams();

    const func = type === 'followers' ? getFollowers : getFollowings;

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useInfiniteList({
            queryKey: [type, params.username],
            queryFn: ({ pageParam = 1 }) =>
                func({
                    params: {
                        username: String(params.username),
                    },
                    page: pageParam,
                }),
        });

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

export default Component;
