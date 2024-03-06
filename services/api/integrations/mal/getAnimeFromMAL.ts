import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.AnimeInfo> {}

export default async function req({
    mal_ids,
}: {
    mal_ids: number[];
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/integrations/mal/anime`,
        method: 'get',
        params: { mal_ids },
    });
}
