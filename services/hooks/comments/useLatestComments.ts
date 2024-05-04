import { useQuery } from '@tanstack/react-query';

import getLatestComments from '@/services/api/comments/getLatestComments';

const useLatestComments = () => {
    return useQuery({
        queryKey: ['latestComments'],
        queryFn: () => getLatestComments(),
    });
};

export default useLatestComments;
