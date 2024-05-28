import { useMutation, useQueryClient } from '@tanstack/react-query';

import vote from '@/services/api/vote/vote';

const useVote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['vote'],
        mutationFn: vote,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['collection'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['comments'] });
            await queryClient.invalidateQueries({
                queryKey: ['commentThread'],
            });
        },
    });
};

export default useVote;
