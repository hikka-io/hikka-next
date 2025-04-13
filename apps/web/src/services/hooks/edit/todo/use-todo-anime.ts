import { convertTitleList } from '../../../../utils/adapters/convert-title';
import getQueryClient from '../../../../utils/get-query-client';
import getTodoAnime, { Params } from '../../../api/edit/todo/getTodoAnime';
import { useSettingsContext } from '../../../providers/settings-provider';
import useInfiniteList from '../../use-infinite-list';

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
