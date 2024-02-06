import useInfiniteList from '@/app/_utils/hooks/useInfiniteList';
import getTodoAnime from '@/app/_utils/api/edit/todo/getTodoAnime';

export const useTodoAnime = (param: string, secret: string) => {
    return useInfiniteList({
        queryKey: ['list', param, secret],
        queryFn: ({ pageParam = 1 }) =>
            getTodoAnime({
                param: param,
                secret: String(secret),
                page: pageParam,
            }),
    })
}