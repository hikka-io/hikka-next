import getComments from '@/services/api/comments/getComments';
import useAuth from '@/services/hooks/auth/useAuth';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useComments = ({
    slug,
    content_type,
}: {
    slug: string;
    content_type: API.ContentType;
}) => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['comments', slug, content_type, { auth }],
        queryFn: ({ pageParam }) =>
            getComments({
                slug,
                content_type,
                page: pageParam,
                auth,
            }),
    });
};

export default useComments;
