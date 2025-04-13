import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import getQueryClient from '../../../utils/get-query-client';
import getLoggedUserInfo from '../../api/user/getLoggedUserInfo';

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
        // await deleteCookie('auth');
        // window.location.reload();
        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/logout`;
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
