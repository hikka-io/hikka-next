'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import FollowUserItem from '@/app/(pages)/u/[username]/_components/follow-user-item';
import { Button } from '@/app/_components/ui/button';
import getFollowings from '@/utils/api/follow/getFollowings';
import useInfiniteList from '@/utils/hooks/useInfiniteList';
import { useAuthContext } from '@/utils/providers/auth-provider';

interface Props {}

const Component = ({}: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { secret } = useAuthContext();

    const {
        list,
        fetchNextPage: fetchNextFollowings,
        isFetchingNextPage: isFetchingNextFollowings,
        hasNextPage: hasNextFollowings,
    } = useInfiniteList({
        queryKey: ['followings', params.username, secret],
        queryFn: ({ pageParam = 1 }) =>
            getFollowings({
                username: String(params.username),
                secret: String(secret),
                page: pageParam,
            }),
    });

    useEffect(() => {
        if (inView) {
            if (hasNextFollowings) {
                fetchNextFollowings();
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
                {hasNextFollowings && (
                    <div className="px-4">
                        <Button
                            variant="secondary"
                            ref={ref}
                            disabled={isFetchingNextFollowings}
                            onClick={() =>
                                hasNextFollowings && fetchNextFollowings()
                            }
                            className="w-full"
                        >
                            {isFetchingNextFollowings && (
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