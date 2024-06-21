import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

import getMangaCatalog, {
    Params as MangaCatalogParams,
    Response as MangaCatalogResponse,
} from '@/services/api/manga/getMangaCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitleList } from '@/utils/title-adapter';

export interface Props extends MangaCatalogParams {
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
    years: props.years || [],
    only_translated: props.only_translated || undefined,
    genres: props.genres || [],
    sort: props.sort || ['score:desc'],
});

export const key = (params: Omit<Props, 'iPage'>): QueryKey => [
    'manga-list',
    params,
];

const useMangaCatalog = (props: Props) => {
    const { titleLanguage } = useSettingsContext();

    const { page, ...params } = paramsBuilder(props);

    const query = useInfiniteQuery<MangaCatalogResponse, Error>({
        queryKey: key({ page, ...params }),
        initialPageParam: props.iPage || page,
        getNextPageParam: (lastPage: MangaCatalogResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: ({ pageParam = page }) =>
            getMangaCatalog({
                params,
                page: Number(pageParam),
                size: 20,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: convertTitleList<API.Manga>({
                    data: a.list,
                    titleLanguage: titleLanguage!,
                }),
            })),
        }),
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

export const prefetchMangaCatalog = (props: Props) => {
    const queryClient = getQueryClient();

    const { page, ...params } = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        queryKey: key({ page, ...params }),
        initialPageParam: props.iPage || page,
        queryFn: ({ pageParam = page }) =>
            getMangaCatalog({
                params,
                page: Number(pageParam),
                size: 20,
            }),
    });
};

export default useMangaCatalog;
