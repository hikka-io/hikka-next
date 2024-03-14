import getPersonAnime from '@/services/api/people/getPersonAnime';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const usePersonAnime = ({ slug }: { slug: string }) => {
    return useInfiniteList({
        queryKey: ['personAnime', slug],
        queryFn: ({ pageParam = 1 }) =>
            getPersonAnime({
                slug: slug,
                page: pageParam,
            }),
    });
};

export default usePersonAnime;
