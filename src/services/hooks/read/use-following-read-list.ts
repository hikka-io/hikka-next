import getFollowingReadList, {
    Params,
} from '@/services/api/read/getFollowingReadList';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
    content_type: props.content_type,
});

export const key = (params: Params) => [
    'following-read-list',
    params.slug,
    params.content_type,
];

const useFollowingReadList = (
    props: {
        slug: string;
        content_type: 'manga' | 'novel';
    },
    options?: Hikka.QueryOptions,
) => {
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getFollowingReadList({
                params,
                page: pageParam,
            }),
        ...options,
    });
};

export const prefetchFollowingReadList = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getFollowingReadList({
                params,
                page: pageParam,
            }),
    });
};

export default useFollowingReadList;
