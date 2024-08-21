import { useMutation, useQueryClient } from '@tanstack/react-query';

import verifyClient from '@/services/api/client/verifyClient';
import { useModalContext } from '@/services/providers/modal-provider';

const useVerifyClient = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['verify-client'],
        mutationFn: verifyClient,
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['clients'] });
            closeModal();
        },
    });
};

export default useVerifyClient;
