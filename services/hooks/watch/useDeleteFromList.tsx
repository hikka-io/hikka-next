import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteWatch from '@/services/api/watch/deleteWatch';
import { useAuthContext } from '@/services/providers/auth-provider';

const useDeleteFromList = ({ slug }: { slug: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromList', secret, slug],
        mutationFn: () =>
            deleteWatch({
                secret: secret!,
                slug: slug,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.refetchQueries({
                queryKey: ['watch', slug, { secret }],
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

export default useDeleteFromList;
