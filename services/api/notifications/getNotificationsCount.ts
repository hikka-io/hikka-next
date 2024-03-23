import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    unseen: number;
}

export default async function req({
    auth,
}: {
    auth?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/notifications/count`,
        method: 'get',
        auth,
    });
}
