import getFollowingReadList from '@/services/api/read/getFollowingReadList';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useFollowingReadList = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: 'manga' | 'novel';
}) => {
    return useInfiniteList({
        queryKey: ['following-read-list', slug, content_type],
        queryFn: ({ pageParam = 1 }) =>
            getFollowingReadList({
                params: { slug, content_type },
                page: pageParam,
            }),
    });
};

export default useFollowingReadList;
