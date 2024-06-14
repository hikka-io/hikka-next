import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import getMangaCatalog, {
    Params as MangaCatalogParams,
    Response as MangaCatalogResponse,
} from '@/services/api/manga/getMangaCatalog';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertMangaList } from '@/utils/title-adapter';

export interface Props extends MangaCatalogParams {
    page: number;
    iPage: number;
}

const useMangaCatalog = ({ page, iPage, ...props }: Props) => {
    const { titleLanguage } = useSettingsContext();
    const searchParams = useSearchParams();

    const search = props.query || searchParams.get('search');
    const types = props.media_type || searchParams.getAll('types');
    const statuses = props.status || searchParams.getAll('statuses');
    const years = props.years || searchParams.getAll('years');
    const genres = props.genres || searchParams.getAll('genres');
    const lang = props.only_translated || searchParams.get('only_translated');
    const sort = searchParams.get('sort') || 'score';
    const order = searchParams.get('order') || 'desc';

    const query = useInfiniteQuery<MangaCatalogResponse, Error>({
        queryKey: [
            'manga-list',
            {
                page,
                search,
                types,
                statuses,
                years,
                lang,
                genres,
                sort,
                order,
            },
        ],
        initialPageParam: iPage || page,
        getNextPageParam: (lastPage: MangaCatalogResponse) => {
            const nextPage = lastPage.pagination.page + 1;
            return nextPage > lastPage.pagination.pages ? undefined : nextPage;
        },
        queryFn: ({ pageParam = page }) =>
            getMangaCatalog({
                params: {
                    query: search,
                    years: years.length == 2 ? years : undefined,
                    status: statuses,
                    media_type: types,
                    sort: [
                        `${sort}:${order}`,
                        ...(sort === 'score' ? ['scored_by:desc'] : []),
                    ],
                    genres,
                    only_translated: Boolean(lang),
                },
                page: Number(pageParam),
                size: 20,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: convertMangaList<API.Manga>({
                    manga: a.list,
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

export default useMangaCatalog;
