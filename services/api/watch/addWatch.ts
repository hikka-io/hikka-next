import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    note: string;
    score: number;
    episodes: number;
    status: API.WatchStatus;
}

export default async function req({
    secret,
    slug,
    note,
    status,
    score,
    rewatches,
    episodes,
}: {
    secret: string;
    slug: string;
    note?: string;
    score?: number;
    episodes?: number;
    rewatches?: number;
    status: API.WatchStatus;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/${slug}`,
        method: 'put',
        params: { note, score, episodes, status, rewatches },
        secret,
    });
}