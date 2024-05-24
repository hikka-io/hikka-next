import getComments, { Params } from '@/services/api/comments/getComments';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useComments = (
    { slug, content_type }: Params,
    options?: Hikka.QueryOptions,
) => {
    return useInfiniteList({
        queryKey: ['comments', slug, content_type],
        queryFn: ({ pageParam }) =>
            getComments({
                params: {
                    slug,
                    content_type,
                },
                page: pageParam,
            }),
        ...options,
    });
};

export default useComments;
