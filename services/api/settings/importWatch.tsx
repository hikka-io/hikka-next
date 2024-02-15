import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    success: boolean;
}

export default async function req({
    overwrite,
    anime,
    secret,
}: {
    overwrite: boolean;
    anime: Record<string, any>[];
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/import/watch`,
        method: 'post',
        secret,
        params: { anime, overwrite },
        enqueueError: true,
    });
}