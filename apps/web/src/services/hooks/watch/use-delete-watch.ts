import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteWatch from '../../api/watch/deleteWatch';

const useDeleteFromList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromList'],
        mutationFn: deleteWatch,
        onSuccess: async () => {
            await queryClient.refetchQueries();
        },
    });
};

export default useDeleteFromList;
