'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';



import { useParams } from 'next/navigation';



import FollowUserItem from '@/app/(pages)/u/[username]/components/ui/follow-user-item';
import { Button } from '@/components/ui/button';
import getFollowers from '@/services/api/follow/getFollowers';
import getFollowings from '@/services/api/follow/getFollowings';
import useAuth from '@/services/hooks/auth/useAuth';
import useInfiniteList from '@/services/hooks/useInfiniteList';



interface Props {
    type: 'followers' | 'followings';
}

const Component = ({ type }: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { auth } = useAuth();

    const func = type === 'followers' ? getFollowers : getFollowings;

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteList({
            queryKey: [type, params.username, auth],
            queryFn: ({ pageParam = 1 }) =>
                func({
                    username: String(params.username),
                    auth: String(auth),
                    page: pageParam,
                }),
        });

    useEffect(() => {
        if (inView) {
            if (hasNextPage) {
                fetchNextPage();
            }
        }
    }, [inView]);

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
                        <Button
                            variant="secondary"
                            ref={ref}
                            disabled={isFetchingNextPage}
                            onClick={() => hasNextPage && fetchNextPage()}
                            className="w-full"
                        >
                            {isFetchingNextPage && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Завантажити ще
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;