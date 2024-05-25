import { useQuery } from '@tanstack/react-query';

import getUserInfo, { Params } from '@/services/api/user/getUserInfo';

const useUser = ({ username }: Params) => {
    return useQuery({
        queryKey: ['user', username],
        queryFn: () => getUserInfo({ params: { username: String(username) } }),
        enabled: !!username,
    });
};

export default useUser;
