import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteRead from '@/services/api/read/deleteRead';

const useDeleteRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-from-read-list'],
        mutationFn: deleteRead,
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ['read'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['novel-list'] });
            await queryClient.invalidateQueries({ queryKey: ['manga-list'] });
            await queryClient.invalidateQueries({
                queryKey: ['read-list'],
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

export default useDeleteRead;
