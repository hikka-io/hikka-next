import { useQuery } from '@tanstack/react-query';

import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import { deleteCookie } from '@/utils/cookies';

const useSession = () => {
    const { data: user } = useQuery({
        queryKey: ['loggedUser'],
        queryFn: () => getLoggedUserInfo(),
    });

    const logout = async () => {
        await deleteCookie('auth');
        window.location.reload();
    };

    return { logout, user };
};

export default useSession;
