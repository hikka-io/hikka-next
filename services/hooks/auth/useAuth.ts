import { useQueryClient } from '@tanstack/react-query';

import { deleteCookie } from '@/app/actions';

const useAuth = () => {
    const queryClient = useQueryClient();
    const auth: string | undefined = queryClient.getQueryData(['auth']);

    const logout = async () => {
        await deleteCookie('auth');
        window.location.reload();
    };

    return { auth, logout };
};

export default useAuth;
