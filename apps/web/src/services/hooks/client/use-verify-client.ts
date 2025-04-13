import { useMutation, useQueryClient } from '@tanstack/react-query';

import verifyClient from '../../api/client/verifyClient';
import { useModalContext } from '../../providers/modal-provider';

const useVerifyClient = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['verify-client'],
        mutationFn: verifyClient,
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

export default useVerifyClient;
