import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';

import getNovelCatalog, {
    Params as NovelCatalogParams,
    Response as NovelCatalogResponse,
} from '@/services/api/novel/getNovelCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitleList } from '@/utils/title-adapter';

export interface Props extends NovelCatalogParams {
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
    'novel-list',
    params,
];

const useNovelCatalog = (props: Props) => {
    const { titleLanguage } = useSettingsContext();

    const { page, ...params } = paramsBuilder(props);

    const query = useInfiniteQuery<NovelCatalogResponse, Error>({
        queryKey: key({ page, ...params }),
        initialPageParam: props.iPage || page,
        getNextPageParam: (lastPage: NovelCatalogResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: ({ pageParam = page }) =>
            getNovelCatalog({
                params,
                page: Number(pageParam),
                size: 20,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: convertTitleList<API.Novel>({
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

export const prefetchNovelCatalog = (props: Props) => {
    const queryClient = getQueryClient();

    const { page, ...params } = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        queryKey: key({ page, ...params }),
        initialPageParam: props.iPage || page,
        queryFn: ({ pageParam = page }) =>
            getNovelCatalog({
                params,
                page: Number(pageParam),
                size: 20,
            }),
    });
};

export default useNovelCatalog;
