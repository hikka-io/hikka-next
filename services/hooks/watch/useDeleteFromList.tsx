import { useMutation, useQueryClient } from '@tanstack/react-query';

import deleteWatch from '@/services/api/watch/deleteWatch';

const useDeleteFromList = ({ slug }: { slug: string }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['deleteFromList', slug],
        mutationFn: () =>
            deleteWatch({
                params: {
                    slug,
                },
            }),
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: ['watch', slug],
            });
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.invalidateQueries({
                queryKey: ['watchList'],
                exact: false,
            });
            await queryClient.invalidateQueries({ queryKey: ['favorites'] });
            await queryClient.invalidateQueries({ queryKey: ['franchise'] });
            await queryClient.invalidateQueries({ queryKey: ['collection'] });
            await queryClient.invalidateQueries({
                queryKey: ['animeSchedule', {}],
                exact: false,
            });
        },
    });
};

export default useDeleteFromList;
