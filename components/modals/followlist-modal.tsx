'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import FollowUserItem from '@/app/(pages)/u/[username]/_components/ui/follow-user-item';
import { Button } from '@/components/ui/button';
import getFollowers from '@/services/api/follow/getFollowers';
import getFollowings from '@/services/api/follow/getFollowings';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useAuthContext } from '@/services/providers/auth-provider';

interface Props {
    type: 'followers' | 'followings';
}

const Component = ({ type }: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { secret } = useAuthContext();

    const func = type === 'followers' ? getFollowers : getFollowings;

    const { list, fetchNextPage, isFetchingNextPage, hasNextPage } =
        useInfiniteList({
            queryKey: [type, params.username, secret],
            queryFn: ({ pageParam = 1 }) =>
                func({
                    username: String(params.username),
                    secret: String(secret),
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
            <hr className="h-[1px] w-auto -mx-6 bg-border mt-4" />
            <div className="flex-1 overflow-y-scroll w-auto h-full -mx-6">
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
                            Заванатажити ще
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;