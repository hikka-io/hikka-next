import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import { deleteCookie } from '@/utils/cookies';
import getQueryClient from '@/utils/get-query-client';

export const key = () => ['logged-user'];

const useSession = () => {
    const { data: user } = useQuery({
        queryKey: key(),
        queryFn: () => getLoggedUserInfo(),
    });

    const isAdmin = useCallback(() => {
        return user?.role === 'admin';
    }, [user]);

    const isModerator = useCallback(() => {
        return user?.role === 'moderator';
    }, [user]);

    const logout = async () => {
        await deleteCookie('auth');
        window.location.reload();
    };

    return { logout, user, isAdmin, isModerator };
};

export const prefetchSession = async () => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: key(),
        queryFn: () => getLoggedUserInfo(),
    });
};

export default useSession;
