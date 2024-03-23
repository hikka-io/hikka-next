import getTodoAnime from '@/services/api/edit/todo/getTodoAnime';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useTodoAnime = (param: string, auth: string) => {
    return useInfiniteList({
        queryKey: ['list', param, { auth }],
        queryFn: ({ pageParam = 1 }) =>
            getTodoAnime({
                param: param,
                auth: String(auth),
                page: pageParam,
                size: 18,
            }),
    });
};

export default useTodoAnime;
