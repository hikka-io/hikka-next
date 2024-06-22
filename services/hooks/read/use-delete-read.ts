import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteRead from '@/services/api/read/deleteRead';

const useDeleteRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['delete-from-read-list'],
        mutationFn: deleteRead,
        onSuccess: async () => {
            await queryClient.refetchQueries();
        },
    });
};

export default useDeleteRead;
