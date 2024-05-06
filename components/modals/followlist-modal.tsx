'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import FollowUserItem from '@/app/(pages)/(user)/u/[username]/components/ui/follow-user-item';
import LoadMoreButton from '@/components/load-more-button';
import getFollowers from '@/services/api/follow/getFollowers';
import getFollowings from '@/services/api/follow/getFollowings';
import useInfiniteList from '@/services/hooks/useInfiniteList';

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
        <>
            <hr className="-mx-6 mt-4 h-px w-auto bg-border" />
            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {list.map((user) => {
                    return <FollowUserItem key={user.reference} user={user} />;
                })}
                {hasNextPage && (
                    <div className="px-4">
                        <LoadMoreButton
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            ref={ref}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;
