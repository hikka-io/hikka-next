import { useMutation, useQueryClient } from '@tanstack/react-query';

import follow, { Params } from '../../api/follow/follow';

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
            await queryClient.invalidateQueries({
                queryKey: ['user'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['followers'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['followings'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['article'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['articles'],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['article-top'],
                exact: false,
            });
        },
    });
};

export default useFollow;
