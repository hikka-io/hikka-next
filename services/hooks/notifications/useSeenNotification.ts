import { useMutation, useQueryClient } from '@tanstack/react-query';



import seenNotification from '@/services/api/notifications/seenNotification';


import useAuth from '../auth/useAuth';


const useSeenNotification = () => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['seenNotification', { auth }],
        mutationFn: ({ reference }: { reference: string }) =>
            seenNotification({
                reference: reference,
                auth: auth,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['notifications', auth],
            });

            queryClient.invalidateQueries({
                queryKey: ['notificationsCount', auth],
            });
        },
    });
};

export default useSeenNotification;
