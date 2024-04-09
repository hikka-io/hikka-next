import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    success: boolean;
}

export default async function req({
    overwrite,
    anime,
    auth,
}: {
    overwrite: boolean;
    anime: Record<string, any>[];
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/import/watch`,
        method: 'post',
        auth,
        params: { anime, overwrite },
        enqueueError: true,
    });
}
