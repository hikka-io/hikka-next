import getTodoAnime, { Params } from '@/services/api/edit/todo/getTodoAnime';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitleList } from '@/utils/title-adapter';

export const paramsBuilder = (props: Params): Params => ({
    param: props.param,
});

export const key = (params: Params) => ['todo-edit-list', params.param];

const useTodoAnime = (props: Params) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getTodoAnime({
                params,
                page: pageParam,
                size: 18,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: convertTitleList<API.Anime>({
                    data: a.list,
                    titleLanguage: titleLanguage!,
                }),
            })),
        }),
    });
};

export const prefetchTodoAnime = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getTodoAnime({
                params,
                page: pageParam,
                size: 18,
            }),
    });
};

export default useTodoAnime;
