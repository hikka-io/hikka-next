'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';

import FollowUserItem from '@/app/(pages)/u/[username]/_components/follow-user-item';
import { Button } from '@/app/_components/ui/button';
import getFollowers, {
    Response as FollowersResponse,
} from '@/utils/api/follow/getFollowers';
import { useAuthContext } from '@/utils/providers/auth-provider';

interface Props {}

const Component = ({}: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { secret } = useAuthContext();

    const {
        data: followersData,
        fetchNextPage: fetchNextFollowers,
        isFetchingNextPage: isFetchingNextFollowers,
        hasNextPage: hasNextFollowers,
    } = useInfiniteQuery({
        initialPageParam: 1,
        queryKey: ['followers', params.username, secret],
        queryFn: ({ pageParam = 1 }) =>
            getFollowers({
                username: String(params.username),
                secret: String(secret),
                page: pageParam,
            }),
        getNextPageParam: (lastPage: FollowersResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        staleTime: 0,
    });

    useEffect(() => {
        if (inView) {
            if (hasNextFollowers) {
                fetchNextFollowers();
            }
        }
    }, [inView]);

    if (!followersData) {
        return null;
    }

    const followersList =
        followersData && followersData!.pages.map((data) => data.list).flat(1);

    return (
        <>
            <hr className="h-[1px] w-auto -mx-6 bg-border mt-4" />
            <div className="flex-1 overflow-y-scroll w-auto h-full -mx-6">
                {followersList.map((user) => {
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