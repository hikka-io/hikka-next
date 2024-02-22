import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    username,
    secret,
}: {
    username: string;
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/username`,
        method: 'put',
        secret,
        params: { username },
        enqueueError: true,
    });
}