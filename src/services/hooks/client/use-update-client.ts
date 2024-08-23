import { useMutation, useQueryClient } from '@tanstack/react-query';

import updateClient from '@/services/api/client/updateClient';
import { useModalContext } from '@/services/providers/modal-provider';

const useUpdateClient = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['update-client'],
        mutationFn: updateClient,
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['client'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['full-client'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['clients'] });
            closeModal();
        },
    });
};

export default useUpdateClient;
