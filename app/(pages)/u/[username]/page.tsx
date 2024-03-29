import React from 'react';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import getUserActivity from '@/services/api/user/getUserActivity';
import getUserHistory from '@/services/api/user/getUserHistory';
import getQueryClient from '@/utils/getQueryClient';

import Collections from '@/app/(pages)/u/[username]/components/collections';
import Favorites from '@/app/(pages)/u/[username]/components/favorites/favorites';
import History from '@/app/(pages)/u/[username]/components/history/history';
import Statistics from '@/app/(pages)/u/[username]/components/statistics';

interface Props {
    params: {
        username: string;
    };
}

const Component = async ({ params: { username } }: Props) => {
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['favorites', username, { auth, content_type: 'anime' }],
        queryFn: ({ pageParam= 1 }) =>
            getFavouriteList({
                username,
                page: pageParam,
                content_type: 'anime',
                auth,
            }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['history', username],
        queryFn: ({ pageParam }) =>
            getUserHistory({ username, page: pageParam }),
        initialPageParam: 1,
    });

    await queryClient.prefetchQuery({
        queryKey: ['activityStats', username],
        queryFn: () => getUserActivity({ username }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <div className="order-2 flex flex-col gap-12 lg:order-1 lg:gap-16">
                    <Statistics />
                    <Favorites />
                </div>
                <div className="order-1 flex flex-col gap-12 lg:order-2 lg:gap-16">
                    <History />
                    <Collections />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default Component;
