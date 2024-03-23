import { useMutation, useQueryClient } from '@tanstack/react-query';



import addWatch from '@/services/api/watch/addWatch';


import useAuth from '../auth/useAuth';


const useAddWatch = ({ slug }: { slug: string }) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['addToList', slug, { auth }],
        mutationFn: (mutationParams: {
            status: API.WatchStatus;
            score: number;
            episodes: number;
        }) =>
            addWatch({
                auth: auth!,
                slug: slug,
                ...mutationParams,
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['watch'] });
        },
    });
};

export default useAddWatch;
