import { useQuery } from '@tanstack/react-query';

import getCommentThread, {
    Params,
} from '@/services/api/comments/getCommentThread';

const useCommentThread = (
    { reference }: Params,
    options?: Hikka.QueryOptions,
) => {
    return useQuery({
        queryKey: ['commentThread', reference],
        queryFn: () =>
            getCommentThread({
                params: {
                    reference,
                },
            }),
        ...options,
    });
};

export default useCommentThread;
