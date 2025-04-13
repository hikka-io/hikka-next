import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import updateClient from '../../api/client/updateClient';
import { useModalContext } from '../../providers/modal-provider';

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
        onSuccess: () => {
            enqueueSnackbar('Ви успішно оновили застосунок.', {
                variant: 'success',
            });
        },
    });
};

export default useUpdateClient;
