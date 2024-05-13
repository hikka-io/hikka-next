import { useQuery } from '@tanstack/react-query';

import getCommentThread from '@/services/api/comments/getCommentThread';

const useCommentThread = ({
    reference,
    enabled = true,
}: {
    reference: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['commentThread', reference],
        queryFn: () =>
            getCommentThread({
                params: {
                    reference,
                },
            }),
        enabled,
    });
};

export default useCommentThread;
