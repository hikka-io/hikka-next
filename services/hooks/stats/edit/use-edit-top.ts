import getEditTop from '@/services/api/stats/edit/getEditTop';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useEditList = () => {
    return useInfiniteList({
        queryKey: ['editTopStats'],
        queryFn: ({ pageParam }) =>
            getEditTop({
                page: pageParam,
            }),
    });
};

export default useEditList;
