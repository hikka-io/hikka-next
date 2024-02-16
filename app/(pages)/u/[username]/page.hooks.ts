import { useSearchParams } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import checkFollow from '@/services/api/follow/checkFollow';
import follow from '@/services/api/follow/follow';
import getFollowStats from '@/services/api/follow/getFollowStats';
import unfollow from '@/services/api/follow/unfollow';
import getUserActivity from '@/services/api/user/getUserActivity';
import getUserHistory from '@/services/api/user/getUserHistory';
import getUserInfo from '@/services/api/user/getUserInfo';
import getWatchList from '@/services/api/watch/getWatchList';
import getWatchStats from '@/services/api/watch/getWatchStats';
import useInfiniteList from '@/services/hooks/useInfiniteList';

export const useUser = (username: string) => {
    return useQuery({
        queryKey: ['user', username],
        queryFn: () => getUserInfo({ username }),
    });
};

export const useFavorites = (username: string, secret: string) => {
    return useInfiniteList({
        queryKey: ['favorites', { username, secret }],
        queryFn: ({ pageParam = 1 }) =>
            getFavouriteList({
                username: username,
                page: pageParam,
                secret: secret,
            }),
        staleTime: 0,
    });
};

export const useFollowChecker = (
    username: string,
    secret: string,
    enabled?: boolean,
) => {
    return useQuery({
        queryKey: ['followChecker', secret, username],
        queryFn: () =>
            checkFollow({
                secret: secret,
                username: username,
            }),
        enabled: enabled,
    });
};

export const useFollow = ({
    username,
    secret,
}: {
    username: string;
    secret: string;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['follow', username, secret],
        mutationFn: () =>
            follow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export const useUnfollow = ({
    username,
    secret,
}: {
    username: string;
    secret: string;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['unfollow', username, secret],
        mutationFn: () =>
            unfollow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export const useFollowStats = (username: string) => {
    return useQuery({
        queryKey: ['followStats', username],
        queryFn: () => getFollowStats({ username: username }),
    });
};

export const useWatchStats = (username: string) => {
    return useQuery({
        queryKey: ['watchStats', username],
        queryFn: () => getWatchStats({ username: username }),
    });
};

export const useWatchList = ({
    username,
    watch_status,
}: {
    username: string;
    watch_status: Hikka.WatchStatus;
}) => {
    const searchParams = useSearchParams();

    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');

    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'watch_score';

    return useInfiniteList({
        queryKey: [
            'watchList',
            username,
            {
                watch_status,
                types,
                statuses,
                seasons,
                ageRatings,
                genres,
                order,
                sort,
                years,
            },
        ],
        queryFn: ({ pageParam = 1 }) =>
            getWatchList({
                username: username,
                watch_status: watch_status,
                page: pageParam,
                media_type: types,
                season: seasons,
                rating: ageRatings,
                status: statuses,
                sort: [`${sort}:${order}`],
                genres,
                years: years && years.length == 2 ? years : undefined,
            }),
    });
};

export const useActivityList = ({ username }: { username: string }) => {
    return useInfiniteList({
        queryKey: ['activity', username],
        queryFn: ({ pageParam }) =>
            getUserHistory({
                username: username,
                page: pageParam,
            }),
    });
};

export const useActivityStats = ({ username }: { username: string }) => {
    return useQuery({
        queryKey: ['activityStats', username],
        queryFn: () => getUserActivity({ username: username }),
    });
};
