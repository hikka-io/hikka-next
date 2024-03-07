import { useMutation, useQueryClient } from '@tanstack/react-query';

import addWatch from '@/services/api/watch/addWatch';
import { useAuthContext } from '@/services/providers/auth-provider';

const useAddToList = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList', slug],
        mutationFn: (mutationParams: {
            status: API.WatchStatus;
            score?: number;
            episodes?: number;
            note?: string;
            rewatches?: number;
        }) =>
            addWatch({
                secret: secret!,
                slug: slug,
                ...mutationParams,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.refetchQueries({
                queryKey: ['watch', slug, { secret }],
                exact: false,
            });
            await queryClient.invalidateQueries({
                queryKey: ['watchList'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['favorites'] });
            await queryClient.invalidateQueries({ queryKey: ['franchise'] });
            await queryClient.invalidateQueries({ queryKey: ['collection'] });
        },
    });
};

export default useAddToList;