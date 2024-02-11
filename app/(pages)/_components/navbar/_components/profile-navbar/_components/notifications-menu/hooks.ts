import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getNotifications from '@/services/api/notifications/getNotifications';
import getNotificationsCount from '@/services/api/notifications/getNotificationsCount';
import seenNotification from '@/services/api/notifications/seenNotification';
import useInfiniteList from '@/services/hooks/useInfiniteList';

export const useInvalidateNotifications = (secret: string) => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({
            queryKey: ['notifications', secret],
        });

        queryClient.invalidateQueries({
            queryKey: ['notificationsCount', secret],
        });
    };
};

export const useNotifications = (secret: string) => {
    return useInfiniteList({
        queryFn: ({ pageParam }) =>
            getNotifications({ page: pageParam, secret: secret }),
        queryKey: ['notifications', secret],
        staleTime: 0,
    });
};

export const useNotificationsCount = (secret: string) => {
    return useQuery({
        queryFn: () => getNotificationsCount({ secret: secret }),
        queryKey: ['notificationsCount', secret],
        staleTime: 0,
        refetchInterval: 30000,
    });
};

export const useSeenNotification = (secret: string) => {
    return useMutation({
        mutationFn: ({ reference }: { reference: string }) =>
            seenNotification({
                reference: reference,
                secret: secret,
            }),
        onSuccess: () => useInvalidateNotifications(secret)(),
    });
};
