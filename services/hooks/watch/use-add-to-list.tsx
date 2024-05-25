import { useMutation, useQueryClient } from '@tanstack/react-query';

import addWatch, { Params } from '@/services/api/watch/addWatch';
import { useModalContext } from '@/services/providers/modal-provider';

const useAddToList = ({ slug }: { slug: string }) => {
    const { closeModal } = useModalContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList', slug],
        mutationFn: (mutationParams: Omit<Params, 'slug'>) =>
            addWatch({
                params: {
                    ...mutationParams,
                    slug: slug,
                },
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.refetchQueries({
                queryKey: ['watch', slug],
                exact: false,
            });
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

            closeModal();
        },
    });
};

export default useAddToList;
