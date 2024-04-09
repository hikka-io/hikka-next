import { useMutation, useQueryClient } from '@tanstack/react-query';

import addWatch from '@/services/api/watch/addWatch';

import useAuth from '../auth/useAuth';

const useAddToList = ({ slug }: { slug: string }) => {
    const { auth } = useAuth();
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
                auth: auth!,
                slug: slug,
                ...mutationParams,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['list'] });
            await queryClient.refetchQueries({
                queryKey: ['watch', slug, { auth }],
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
        },
    });
};

export default useAddToList;
