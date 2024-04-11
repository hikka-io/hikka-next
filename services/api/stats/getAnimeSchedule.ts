import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.AnimeSchedule> {}

export default async function req({
    airing_season,
    status,
    only_watch,
    page = 1,
    size = 15,
    auth,
}: {
    airing_season?: [API.Season, string];
    status?: API.Status[];
    page?: number;
    size?: number;
    only_watch?: boolean;
    auth?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/schedule/anime`,
        method: 'post',
        params: {
            airing_season,
            status,
            rating: ['g', 'pg', 'pg_13', 'r', 'r_plus'],
            only_watch,
        },
        page,
        size,
        auth,
    });
}
