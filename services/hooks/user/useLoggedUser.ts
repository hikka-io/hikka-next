import { useQuery } from '@tanstack/react-query';



import getLoggedUserInfo from '@/services/api/user/getLoggedUserInfo';


import useAuth from '../auth/useAuth';


const useLoggedUser = () => {
    const { auth } = useAuth();

    return useQuery({
        queryKey: ['loggedUser', auth],
        queryFn: () => getLoggedUserInfo({ auth }),
        enabled: Boolean(auth),
    });
};

export default useLoggedUser;
