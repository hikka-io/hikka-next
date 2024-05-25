import getAnimeStaff, { Params } from '@/services/api/anime/getAnimeStaff';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useStaff = ({ slug }: Params) => {
    return useInfiniteList({
        queryKey: ['staff', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeStaff({ params: { slug }, page: pageParam }),
    });
};

export default useStaff;
