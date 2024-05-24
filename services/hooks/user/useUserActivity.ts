import { useQuery } from '@tanstack/react-query';

import getUserActivity, { Params } from '@/services/api/user/getUserActivity';

const useUserActivity = ({ username }: Params) => {
    return useQuery({
        queryKey: ['activityStats', username],
        queryFn: () => getUserActivity({ params: { username } }),
    });
};

export default useUserActivity;
