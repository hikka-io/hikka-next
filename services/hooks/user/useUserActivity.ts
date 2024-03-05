import { useQuery } from '@tanstack/react-query';

import getUserActivity from '@/services/api/user/getUserActivity';

const useUserActivity = ({ username }: { username: string }) => {
    return useQuery({
        queryKey: ['activityStats', username],
        queryFn: () => getUserActivity({ username: username }),
    });
};

export default useUserActivity;
