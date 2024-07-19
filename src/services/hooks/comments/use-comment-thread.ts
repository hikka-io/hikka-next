import { QueryKey, useQuery } from '@tanstack/react-query';

import getCommentThread, {
    Params,
} from '@/services/api/comments/getCommentThread';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    reference: props.reference || '',
});

export const key = (params: Params): QueryKey => [
    'comment-thread',
    params.reference,
];

const useCommentThread = (props: Params, options?: Hikka.QueryOptions) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getCommentThread({
                params,
            }),
        ...options,
    });
};

export const prefetchCommentThread = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getCommentThread({
                params,
            }),
    });
};

export default useCommentThread;
