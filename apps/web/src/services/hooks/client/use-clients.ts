import { QueryKey, useQuery } from '@tanstack/react-query';

import getQueryClient from '../../../utils/get-query-client';
import getClients from '../../api/client/getClients';

export const key = (): QueryKey => ['clients'];

const useClients = (options?: Hikka.QueryOptions) => {
    return useQuery({
        queryKey: key(),
        queryFn: () => getClients(),
        ...options,
        refetchOnWindowFocus: false,
    });
};

export const prefetchClients = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(),
        queryFn: () => getClients(),
    });
};

export default useClients;
