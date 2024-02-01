'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import FollowUserItem from '@/app/(pages)/u/[username]/_components/ui/follow-user-item';
import { Button } from '@/app/_components/ui/button';
import getFollowers from '@/app/_utils/api/follow/getFollowers';
import useInfiniteList from '@/app/_utils/hooks/useInfiniteList';
import { useAuthContext } from '@/app/_utils/providers/auth-provider';

interface Props {}

const Component = ({}: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { secret } = useAuthContext();

    const {
        list,
        fetchNextPage: fetchNextFollowers,
        isFetchingNextPage: isFetchingNextFollowers,
        hasNextPage: hasNextFollowers,
    } = useInfiniteList({
        queryKey: ['followers', params.username, secret],
        queryFn: ({ pageParam = 1 }) =>
            getFollowers({
                username: String(params.username),
                secret: String(secret),
                page: pageParam,
            }),
    });

    useEffect(() => {
        if (inView) {
            if (hasNextFollowers) {
                fetchNextFollowers();
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
                {hasNextFollowers && (
                    <div className="px-4">
                        <Button
                            variant="secondary"
                            ref={ref}
                            disabled={isFetchingNextFollowers}
                            onClick={() =>
                                hasNextFollowers && fetchNextFollowers()
                            }
                            className="w-full"
                        >
                            {isFetchingNextFollowers && (
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