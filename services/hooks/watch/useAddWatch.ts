import { useMutation, useQueryClient } from '@tanstack/react-query';

import addWatch from '@/services/api/watch/addWatch';

const useAddWatch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList'],
        mutationFn: addWatch,
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ['watch'], exact: false });
            await queryClient.invalidateQueries({ queryKey: ['watchList'], exact: false });
        },
    });
};

export default useAddWatch;
