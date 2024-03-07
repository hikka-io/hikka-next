import { useSearchParams } from 'next/navigation';

import { useInfiniteQuery } from '@tanstack/react-query';

import getAnimeCatalog, {
    Response as AnimeCatalogResponse,
} from '@/services/api/anime/getAnimeCatalog';

export interface Props {
    page: number;
    iPage: number;
    secret?: string | null;
}

const useAnimeCatalog = ({ page, iPage, secret }: Props) => {
    const searchParams = useSearchParams();

    const search = searchParams.get('search');
    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');
    const lang = searchParams.get('only_translated');
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
                secret,
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
                only_translated: Boolean(lang),
                page: Number(pageParam),
                secret: String(secret),
                size: 20,
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
