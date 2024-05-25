import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import getAnimeCatalog, {
    Params as AnimeCatalogParams,
    Response as AnimeCatalogResponse,
} from '@/services/api/anime/getAnimeCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnimeList } from '@/utils/anime-adapter';

export interface Props extends AnimeCatalogParams {
    page: number;
    iPage: number;
}

const useAnimeCatalog = ({ page, iPage, ...props }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const searchParams = useSearchParams();

    const search = props.query || searchParams.get('search');
    const types = props.media_type || searchParams.getAll('types');
    const statuses = props.status || searchParams.getAll('statuses');
    const seasons = props.season || searchParams.getAll('seasons');
    const ageRatings = props.rating || searchParams.getAll('ratings');
    const years = props.years || searchParams.getAll('years');
    const genres = props.genres || searchParams.getAll('genres');
    const studios = props.studios || searchParams.getAll('studios');
    const lang = props.only_translated || searchParams.get('only_translated');
    const sort = searchParams.get('sort') || 'score';
    const order = searchParams.get('order') || 'desc';

    const query = useInfiniteQuery<AnimeCatalogResponse, Error>({
        queryKey: [
            'list',
            {
                page,
                search,
                types,
                statuses,
                seasons,
                ageRatings,
                years,
                lang,
                genres,
                studios,
                sort,
                order,
            },
        ],
        initialPageParam: iPage || page,
        getNextPageParam: (lastPage: AnimeCatalogResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: ({ pageParam = page }) =>
            getAnimeCatalog({
                params: {
                    query: search,
                    years: years.length == 2 ? years : undefined,
                    rating: ageRatings,
                    season: seasons,
                    status: statuses,
                    media_type: types,
                    sort: [
                        `${sort}:${order}`,
                        ...(sort === 'score' ? ['scored_by:desc'] : []),
                    ],
                    genres,
                    studios,
                    only_translated: Boolean(lang),
                },
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
