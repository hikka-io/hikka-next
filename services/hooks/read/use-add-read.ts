import { useMutation, useQueryClient } from '@tanstack/react-query';

import addRead from '@/services/api/read/addRead';
import { useModalContext } from '@/services/providers/modal-provider';

const useAddRead = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['add-to-read-list'],
        mutationFn: addRead,
        onSettled: async () => {
            await queryClient.invalidateQueries();

            closeModal();
        },
    });
};

export default useAddRead;
