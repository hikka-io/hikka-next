import { QueryKey, useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import getAnimeCatalog, {
    Params as AnimeCatalogParams,
    Response as AnimeCatalogResponse,
} from '@/services/api/anime/getAnimeCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnimeList } from '@/utils/title-adapter';

export interface Props extends AnimeCatalogParams {
    page: number;
    iPage: number;
}

export const paramsBuilder = (props: Props): Props => ({
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
    iPage: props.iPage || 1,
});

export const key = (params: Props): QueryKey => ['list', params];

const useAnimeCatalog = ({ page: _page, iPage: _iPage, ...props }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const searchParams = useSearchParams();

    const search = props.query || searchParams.get('search');
    const media_type = props.media_type || searchParams.getAll('types');
    const status = props.status || searchParams.getAll('statuses');
    const season = props.season || searchParams.getAll('seasons');
    const rating = props.rating || searchParams.getAll('ratings');
    const years = props.years || searchParams.getAll('years');
    const genres = props.genres || searchParams.getAll('genres');
    const studios = props.studios || searchParams.getAll('studios');
    const only_translated = Boolean(
        props.only_translated || searchParams.get('only_translated'),
    );
    const sort = searchParams.get('sort') || 'score';
    const order = searchParams.get('order') || 'desc';

    const { page, iPage, ...params } = paramsBuilder({
        page: _page,
        iPage: _iPage,
        query: search,
        media_type,
        status,
        season,
        rating,
        years,
        genres,
        studios,
        only_translated,
        sort: sort && order ? [`${sort}:${order}`] : undefined,
    });

    const query = useInfiniteQuery<AnimeCatalogResponse, Error>({
        queryKey: key({ page, iPage, ...params }),
        initialPageParam: iPage || page,
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
                list: convertAnimeList<API.Anime>({
                    anime: a.list,
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

export default useAnimeCatalog;
