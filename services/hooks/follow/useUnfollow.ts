import { useMutation, useQueryClient } from '@tanstack/react-query';

import unfollow from '@/services/api/follow/unfollow';

const useUnfollow = ({
    username,
    secret,
}: {
    username: string;
    secret: string;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['unfollow', username, secret],
        mutationFn: () =>
            unfollow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useUnfollow;
