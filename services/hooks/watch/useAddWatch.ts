import { useMutation, useQueryClient } from '@tanstack/react-query';

import addWatch from '@/services/api/watch/addWatch';
import { useAuthContext } from '@/services/providers/auth-provider';

const useAddWatch = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList', slug, { secret }],
        mutationFn: (mutationParams: {
            status: API.WatchStatus;
            score: number;
            episodes: number;
        }) =>
            addWatch({
                secret: secret!,
                slug: slug,
                ...mutationParams,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['watch'] });
        },
    });
};

export default useAddWatch;
