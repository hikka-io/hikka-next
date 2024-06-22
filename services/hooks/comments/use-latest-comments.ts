import { QueryKey, useQuery } from '@tanstack/react-query';

import getLatestComments from '@/services/api/comments/getLatestComments';
import getQueryClient from '@/utils/get-query-client';

export const key = (): QueryKey => ['latest-comments'];

const useLatestComments = () => {
    return useQuery({
        queryKey: key(),
        queryFn: () => getLatestComments(),
    });
};

export const prefetchLatestComments = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(),
        queryFn: () => getLatestComments(),
    });
};

export default useLatestComments;
