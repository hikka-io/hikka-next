import { useMutation, useQueryClient } from '@tanstack/react-query';

import follow from '@/services/api/follow/follow';

const useFollow = ({
    username,
    secret,
}: {
    username: string;
    secret: string;
}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['follow', username, secret],
        mutationFn: () =>
            follow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useFollow;
