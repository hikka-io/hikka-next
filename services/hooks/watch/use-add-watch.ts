import { useMutation, useQueryClient } from '@tanstack/react-query';

import addWatch from '@/services/api/watch/addWatch';
import { useModalContext } from '@/services/providers/modal-provider';

const useAddWatch = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList'],
        mutationFn: addWatch,
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.refetchQueries({
                queryKey: ['watch'],
                exact: false,
            });
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

            closeModal();
        },
    });
};

export default useAddWatch;
