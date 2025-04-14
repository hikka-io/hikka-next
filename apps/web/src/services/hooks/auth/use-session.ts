import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useAPIClient } from '@/services/providers/api-client-provider';
import getAPIClient from '@/utils/get-api-client';
import getQueryClient from '@/utils/get-query-client';

export const key = () => ['logged-user'];

const useSession = () => {
    const apiClient = useAPIClient();
    const { data: user } = useQuery({
        queryKey: key(),
        queryFn: () => apiClient.user.getMe(),
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
    const apiClient = await getAPIClient();

    await queryClient.prefetchQuery({
        queryKey: key(),
        queryFn: () => apiClient.user.getMe(),
    });
};

export default useSession;
