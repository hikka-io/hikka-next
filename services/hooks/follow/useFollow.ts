import { useMutation, useQueryClient } from '@tanstack/react-query';

import follow from '@/services/api/follow/follow';

import useAuth from '../auth/useAuth';

const useFollow = ({ username }: { username: string }) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['follow', username, { auth }],
        mutationFn: () =>
            follow({
                auth: auth!,
                username: username,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useFollow;
