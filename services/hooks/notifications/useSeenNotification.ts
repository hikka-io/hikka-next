import { useMutation, useQueryClient } from '@tanstack/react-query';

import seenNotification from '@/services/api/notifications/seenNotification';
import { useAuthContext } from '@/services/providers/auth-provider';

const useSeenNotification = () => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['seenNotification', { secret }],
        mutationFn: ({ reference }: { reference: string }) =>
            seenNotification({
                reference: reference,
                secret: secret,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications', secret],
            });

            queryClient.invalidateQueries({
                queryKey: ['notificationsCount', secret],
            });
        },
    });
};

export default useSeenNotification;
