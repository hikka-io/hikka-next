import { useMutation, useQueryClient } from '@tanstack/react-query';

import addWatch from '@/services/api/watch/addWatch';

const useAddWatch = ({ slug }: { slug: string }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList', slug],
        mutationFn: (mutationParams: {
            status: API.WatchStatus;
            score: number;
            episodes: number;
            rewatches?: number;
        }) =>
            addWatch({
                params: {
                    slug: slug,
                    ...mutationParams,
                },
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['watch'] });
        },
    });
};

export default useAddWatch;
