import { useQuery } from '@tanstack/react-query';

import getUserInfo from '@/services/api/user/getUserInfo';

const useUser = ({ username }: { username?: string }) => {
    return useQuery({
        queryKey: ['user', username],
        queryFn: () => getUserInfo({ params: { username: String(username) } }),
        enabled: !!username,
    });
};

export default useUser;
