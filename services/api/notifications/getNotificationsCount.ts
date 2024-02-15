import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    unseen: number;
}

export default async function req({
    secret,
}: {
    secret?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/notifications/count`,
        method: 'get',
        secret,
    });
}
