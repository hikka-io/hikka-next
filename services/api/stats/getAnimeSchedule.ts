import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.AnimeSchedule> {}

export default async function req({
    airing_season,
    status,
    page = 1,
    size = 15,
    auth,
}: {
    airing_season?: API.Season[];
    status?: API.Status;
    page?: number;
    size?: number;
    auth?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/schedule/anime`,
        method: 'post',
        params: { airing_season, status },
        page,
        size,
        auth,
    });
}
