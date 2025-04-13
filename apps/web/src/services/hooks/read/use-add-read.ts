import { useMutation, useQueryClient } from '@tanstack/react-query';

import addRead from '../../api/read/addRead';
import { useModalContext } from '../../providers/modal-provider';

const useAddRead = () => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['add-to-read-list'],
        mutationFn: addRead,
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['novel-list'] });
            await queryClient.invalidateQueries({ queryKey: ['manga-list'] });
            await queryClient.refetchQueries({
                queryKey: ['read'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['read-list'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['favorites'] });
            await queryClient.invalidateQueries({ queryKey: ['franchise'] });
            await queryClient.invalidateQueries({ queryKey: ['collection'] });
            await queryClient.invalidateQueries({
                queryKey: ['anime-schedule'],
                exact: false,
            });

            closeModal();
        },
    });
};

export default useAddRead;
