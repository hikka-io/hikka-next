import { useQuery } from '@tanstack/react-query';

import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import getQueryClient from '@/utils/get-query-client';

export const key = () => ['logged-user'];

const useSession = () => {
    const { data: user } = useQuery({
        queryKey: key(),
        queryFn: () => getLoggedUserInfo(),
    });

    const logout = async () => {
        // await deleteCookie('auth');
        // window.location.reload();
        window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/logout`;
    };

    return { logout, user };
};

export const prefetchSession = async () => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: key(),
        queryFn: () => getLoggedUserInfo(),
    });
};

export default useSession;
