import { useMutation, useQueryClient } from '@tanstack/react-query';

import follow, { Params } from '@/services/api/follow/follow';

const useFollow = ({ username }: Params) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['follow', username],
        mutationFn: () =>
            follow({
                params: {
                    username,
                },
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useFollow;
