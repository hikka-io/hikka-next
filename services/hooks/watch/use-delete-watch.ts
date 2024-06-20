import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteWatch from '@/services/api/watch/deleteWatch';

const useDeleteFromList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromList'],
        mutationFn: deleteWatch,
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ['watch'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.invalidateQueries({
                queryKey: ['watch-list'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['favorites'] });
            await queryClient.invalidateQueries({ queryKey: ['franchise'] });
            await queryClient.invalidateQueries({ queryKey: ['collection'] });
            await queryClient.invalidateQueries({
                queryKey: ['anime-schedule', {}],
                exact: false,
            });
        },
    });
};

export default useDeleteFromList;
