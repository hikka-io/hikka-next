import { useMutation, useQueryClient } from '@tanstack/react-query';

import seenNotification from '@/services/api/notifications/seenNotification';

const useSeenNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['seenNotification'],
        mutationFn: ({ reference }: { reference: string }) =>
            seenNotification({
                params: {
                    reference,
                },
            }),
        onSuccess: () => {
            queryClient.refetchQueries({
                queryKey: ['notifications'],
                exact: false,
            });

            queryClient.refetchQueries({
                queryKey: ['notificationsCount'],
                exact: false,
            });
        },
    });
};

export default useSeenNotification;
