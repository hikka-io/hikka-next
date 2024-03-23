import { useMutation, useQueryClient } from '@tanstack/react-query';



import unfollow from '@/services/api/follow/unfollow';


import useAuth from '../auth/useAuth';


const useUnfollow = ({ username }: { username: string }) => {
    const { auth } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['unfollow', username, { auth }],
        mutationFn: () =>
            unfollow({
                auth: String(auth),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useUnfollow;
