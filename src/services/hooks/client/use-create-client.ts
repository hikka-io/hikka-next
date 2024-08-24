import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import createClient from '@/services/api/client/createClient';
import { useModalContext } from '@/services/providers/modal-provider';

const useCreateClient = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['create-client'],
        mutationFn: createClient,
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['clients'] });
            closeModal();
        },
        onSuccess: () => {
            enqueueSnackbar('Ви успішно створили застосунок.', {
                variant: 'success',
            });
        },
    });
};

export default useCreateClient;
