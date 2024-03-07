import { useMutation, useQueryClient } from '@tanstack/react-query';

import follow from '@/services/api/follow/follow';
import { useAuthContext } from '@/services/providers/auth-provider';

const useFollow = ({ username }: { username: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['follow', username, { secret }],
        mutationFn: () =>
            follow({
                secret: secret!,
                username: username,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useFollow;
