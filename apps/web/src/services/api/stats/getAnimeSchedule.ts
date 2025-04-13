import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<API.AnimeSchedule> {}

export interface Params {
    airing_season?: [API.Season, string];
    status?: API.Status[];
    only_watch?: boolean;
}

export default async function req({
    params,
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/schedule/anime`,
        method: 'post',
        params: {
            rating: ['g', 'pg', 'pg_13', 'r', 'r_plus'],
            ...params,
        },
        page,
        size,
    });
}
