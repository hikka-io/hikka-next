import React from 'react';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import getUserActivity from '@/services/api/user/getUserActivity';
import getUserHistory from '@/services/api/user/getUserHistory';
import getQueryClient from '@/utils/getQueryClient';

import ActivationAlert from './_components/activation-alert';
import Collections from './_components/collections';
import Favorites from './_components/favorites';
import History from './_components/history/history';
import Statistics from './_components/statistics';

interface Props {
    params: {
        username: string;
    };
}

const Component = async ({ params: { username } }: Props) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['favorites', { username, secret }],
        queryFn: ({ pageParam }) =>
            getFavouriteList({ username, page: pageParam }),
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
                <div className="flex flex-col gap-12 lg:gap-16 order-2 lg:order-1">
                    <ActivationAlert />
                    <Statistics />
                    <Favorites />
                </div>
                <div className="flex flex-col gap-12 lg:gap-16 order-1 lg:order-2">
                    <History />
                    <Collections />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default Component;
