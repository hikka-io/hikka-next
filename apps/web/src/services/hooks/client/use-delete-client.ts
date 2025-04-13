import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import deleteClient from '../../api/client/deleteClient';
import { useModalContext } from '../../providers/modal-provider';

const useDeleteClient = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-client'],
        mutationFn: deleteClient,
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
        onSuccess: () => {
            enqueueSnackbar('Ви успішно видалили застосунок.', {
                variant: 'success',
            });
        },
    });
};

export default useDeleteClient;
