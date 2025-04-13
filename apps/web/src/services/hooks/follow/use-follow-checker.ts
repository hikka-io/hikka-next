import { useQuery } from '@tanstack/react-query';

import getQueryClient from '../../../utils/get-query-client';
import checkFollow, { Params } from '../../api/follow/checkFollow';

export const paramsBuilder = (props: Params): Params => ({
    username: props.username,
});

export const key = (params: Params) => ['follow-checker', params.username];

const useFollowChecker = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            checkFollow({
                params,
            }),
        ...options,
    });
};

export const prefetchFollowChecker = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            checkFollow({
                params,
            }),
    });
};

export default useFollowChecker;
