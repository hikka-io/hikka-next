import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getFavouriteList from '@/services/api/favourite/getFavouriteList';
import checkFollow from '@/services/api/follow/checkFollow';
import follow from '@/services/api/follow/follow';
import getFollowStats from '@/services/api/follow/getFollowStats';
import unfollow from '@/services/api/follow/unfollow';
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

export const useFollow = (username: string, secret: string) => {
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

export const useUnfollow = (username: string, secret: string) => {
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
    status,
    order,
    sort,
}: {
    username: string;
    status: string;
    order?: string;
    sort?: string;
}) => {
    return useInfiniteList({
        queryKey: ['watchList', username, { status, order, sort }],
        queryFn: ({ pageParam = 1 }) =>
            getWatchList({
                username: username,
                status: status as Hikka.WatchStatus,
                page: pageParam,
                order: order as 'score' | 'episodes' | 'media_type' | undefined,
                sort: sort as 'asc' | 'desc' | undefined,
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