import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteClient from '@/services/api/client/deleteClient';
import { useModalContext } from '@/services/providers/modal-provider';

const useDeleteClient = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-client'],
        mutationFn: deleteClient,
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['clients'] });
            closeModal();
        },
    });
};

export default useDeleteClient;
