import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

import getAnimeCatalog, {
    Params as AnimeCatalogParams,
    Response as AnimeCatalogResponse,
} from '@/services/api/anime/getAnimeCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitleList } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';

export interface Props extends AnimeCatalogParams {
    page: number;
    iPage: number;
}

export const paramsBuilder = (
    props: Omit<Props, 'iPage'>,
): Omit<Props, 'iPage'> => ({
    page: props.page || 1,
    query: props.query || undefined,
    media_type: props.media_type || [],
    status: props.status || [],
    season: props.season || [],
    rating: props.rating || [],
    years: props.years || [],
    only_translated: props.only_translated || undefined,
    genres: props.genres || [],
    studios: props.studios || [],
    sort: props.sort || ['score:desc'],
});

export const key = (params: Omit<Props, 'iPage'>): QueryKey => [
    'anime-list',
    params,
];

const useAnimeCatalog = (props: Props) => {
    const { titleLanguage } = useSettingsContext();

    const { page, ...params } = paramsBuilder(props);

    const query = useInfiniteQuery<AnimeCatalogResponse, Error>({
        queryKey: key({ page, ...params }),
        initialPageParam: props.iPage || page,
        getNextPageParam: (lastPage: AnimeCatalogResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: ({ pageParam = page }) =>
            getAnimeCatalog({
                params,
                page: Number(pageParam),
                size: 20,
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
        refetchOnWindowFocus: false,
    });

    const list =
        query.data && query.data.pages.map((data) => data.list).flat(1);
    const pagination =
        query.data &&
        query.data.pages.length > 0 &&
        query.data.pages[query.data.pages.length - 1].pagination;

    return {
        ...query,
        list,
        pagination,
    };
};

export const prefetchAnimeCatalog = (props: Props) => {
    const queryClient = getQueryClient();

    const { page, ...params } = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        queryKey: key({ page, ...params }),
        initialPageParam: props.iPage || page,
        queryFn: ({ pageParam = page }) =>
            getAnimeCatalog({
                params,
                page: Number(pageParam),
                size: 20,
            }),
    });
};

export default useAnimeCatalog;
