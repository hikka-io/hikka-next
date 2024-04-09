import { fetchRequest } from '@/services/api/fetchRequest';

export default async function req({
    mal_ids,
}: {
    mal_ids: number[];
}): Promise<API.AnimeInfo[]> {
    return fetchRequest<API.AnimeInfo[]>({
        path: `/integrations/mal/anime`,
        method: 'post',
        params: { mal_ids },
    });
}
