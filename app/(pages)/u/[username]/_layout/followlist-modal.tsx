'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';

import FollowUserItem from '@/app/(pages)/u/[username]/_components/follow-user-item';
import { Button } from '@/app/_components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/app/_components/ui/sheet';
import getFollowers, {
    Response as FollowersResponse,
} from '@/utils/api/follow/getFollowers';
import getFollowings, {
    Response as FollowingsResponse,
} from '@/utils/api/follow/getFollowings';
import { useAuthContext } from '@/utils/providers/auth-provider';
import { useModalContext } from '@/utils/providers/modal-provider';

interface Props {}

const Component = ({}: Props) => {
    const { ref, inView } = useInView();
    const params = useParams();
    const { followings, followers, closeModals } = useModalContext();
    const { secret } = useAuthContext();

    const {
        data: followersData,
        fetchNextPage: fetchNextFollowers,
        isFetchingNextPage: isFetchingNextFollowers,
        hasNextPage: hasNextFollowers,
    } = useInfiniteQuery({
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
        enabled: followers,
    });

    const {
        data: followingsData,
        fetchNextPage: fetchNextFollowings,
        isFetchingNextPage: isFetchingNextFollowings,
        hasNextPage: hasNextFollowings,
    } = useInfiniteQuery({
        queryKey: ['followings', params.username, secret],
        queryFn: ({ pageParam = 1 }) =>
            getFollowings({
                username: String(params.username),
                secret: String(secret),
                page: pageParam,
            }),
        getNextPageParam: (lastPage: FollowingsResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        staleTime: 0,
        enabled: followings,
    });

    useEffect(() => {
        if (inView) {
            if (hasNextFollowers) {
                fetchNextFollowers();
            } else {
                fetchNextFollowings();
            }
        }
    }, [inView]);

    if (followers && !followersData) {
        return null;
    }

    if (followings && !followingsData) {
        return null;
    }

    const followersList =
        followersData && followersData!.pages.map((data) => data.list).flat(1);
    const followingsList =
        followingsData &&
        followingsData!.pages.map((data) => data.list).flat(1);

    return (
        <Sheet
            open={Boolean(followings) || Boolean(followers)}
            onOpenChange={(open) => !open && closeModals()}
        >
            <SheetContent side="left" className="!max-w-lg flex flex-col pb-0 gap-0">
                <SheetHeader>
                    <SheetTitle>
                        {followers ? 'Стежить' : 'Відстежується'}
                    </SheetTitle>
                </SheetHeader>
                <hr className="h-[1px] w-auto -mx-6 bg-border mt-4" />
                {(followers || followings) && (
                    <div className="flex-1 overflow-y-scroll w-auto h-full -mx-6">
                        {(followings ? followingsList : followersList)!.map(
                            (user) => {
                                return (
                                    <FollowUserItem
                                        key={user.reference}
                                        user={user}
                                    />
                                );
                            },
                        )}
                        {(hasNextFollowings || hasNextFollowers) && (
                            <div className="px-4">
                                <Button
                                    variant="secondary"
                                    ref={ref}
                                    disabled={
                                        isFetchingNextFollowers ||
                                        isFetchingNextFollowings
                                    }
                                    onClick={() =>
                                        hasNextFollowings
                                            ? fetchNextFollowers()
                                            : fetchNextFollowings()
                                    }
                                    className="w-full"
                                >
                                    {(isFetchingNextFollowers ||
                                        isFetchingNextFollowings) && (
                                        <span className="loading loading-spinner"></span>
                                    )}
                                    Заванатажити ще
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default Component;