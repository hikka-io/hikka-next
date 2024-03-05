import getTodoAnime from '@/services/api/edit/todo/getTodoAnime';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useTodoAnime = (param: string, secret: string) => {
    return useInfiniteList({
        queryKey: ['list', param, secret],
        queryFn: ({ pageParam = 1 }) =>
            getTodoAnime({
                param: param,
                secret: String(secret),
                page: pageParam,
                size: 18,
            }),
    });
};

export default useTodoAnime;
