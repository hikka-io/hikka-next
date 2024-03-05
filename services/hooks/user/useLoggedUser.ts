import { useQuery } from '@tanstack/react-query';

import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';
import { useAuthContext } from '@/services/providers/auth-provider';

const useLoggedUser = () => {
    const { secret } = useAuthContext();

    return useQuery({
        queryKey: ['loggedUser', secret],
        queryFn: () => getLoggedUserInfo({ secret }),
        enabled: Boolean(secret),
    });
};

export default useLoggedUser;
