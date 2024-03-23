import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteWatch from '@/services/api/watch/deleteWatch';

import useAuth from '@/services/hooks/auth/useAuth';

const useDeleteFromList = ({ slug }: { slug: string }) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromList', auth, slug],
        mutationFn: () =>
            deleteWatch({
                auth: auth!,
                slug: slug,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.refetchQueries({
                queryKey: ['watch', slug, { auth }],
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
