import getAnimeStaff from '@/services/api/anime/getAnimeStaff';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useStaff = ({ slug }: { slug: string }) => {
    return useInfiniteList({
        queryKey: ['staff', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeStaff({ params: { slug }, page: pageParam }),
    });
};

export default useStaff;
