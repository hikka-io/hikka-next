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
            await queryClient.invalidateQueries();

            closeModal();
        },
    });
};

export default useAddWatch;
