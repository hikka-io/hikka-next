import React from 'react';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Ongoings from '@/app/(pages)/(root)/components/ongoings';
import UserCover from '@/components/user-cover';
import getFollowingHistory from '@/services/api/history/getFollowingHistory';
import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import getWatchList from '@/services/api/watch/getWatchList';
import getCurrentSeason from '@/utils/getCurrentSeason';
import getQueryClient from '@/utils/getQueryClient';

import Collections from './components/collections';
import Comments from './components/comments';
import History from './components/history/history';
import Profile from './components/profile';
import Schedule from './components/schedule/schedule';
import getCollections from '@/services/api/collections/getCollections';
import getLatestComments from '@/services/api/comments/getLatestComments';


const Page = async () => {
    const season = getCurrentSeason()!;
    const queryClient = await getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['loggedUser'],
        queryFn: ({ meta }) => getLoggedUserInfo({ auth: meta?.auth }),
    });

    const loggedUser: API.User | undefined = queryClient.getQueryData([
        'loggedUser',
    ]);

    if (loggedUser) {
        await queryClient.prefetchInfiniteQuery({
            initialPageParam: 1,
            queryKey: [
                'watchList',
                loggedUser.username,
                {
                    ageRatings: [],
                    genres: [],
                    order: 'desc',
                    seasons: [],
                    sort: 'watch_score',
                    statuses: [],
                    types: [],
                    watch_status: 'watching',
                    years: [],
                },
            ],
            queryFn: ({ pageParam = 1, meta }) =>
                getWatchList({
                    params: {
                        username: loggedUser.username,
                        genres: [],
                        media_type: [],
                        rating: [],
                        season: [],
                        sort: ['watch_score:desc'],
                        status: [],
                        watch_status: 'watching',
                    },
                    page: pageParam,
                    auth: meta?.auth,
                }),
        });

        await queryClient.prefetchInfiniteQuery({
            initialPageParam: 1,
            queryKey: ['followingHistory'],
            queryFn: ({ pageParam, meta }) =>
                getFollowingHistory({
                    page: pageParam,
                    auth: meta?.auth,
                }),
        });
    }

    await queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: [
            'animeSchedule',
            {
                season,
                status: ['ongoing', 'announced'],
                year: String(new Date().getFullYear()),
            },
        ],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                params: {
                    airing_season: [season, String(new Date().getFullYear())],
                    status: ['ongoing', 'announced'],
                },
                page: pageParam,
            }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['collections', { page: 1, sort: 'created' }],
        queryFn: () => getCollections({ page: 1, params: { sort: 'created' } }),
    })

    await queryClient.prefetchQuery({
        queryKey: ['latestComments'],
        queryFn: () => getLatestComments(),
    })

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-16">
                <UserCover />
                <Ongoings />
                {loggedUser && (
                    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                        <Profile />
                        <History />
                    </div>
                )}
                <Schedule />
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                    <Collections />
                    <Comments />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default Page;
