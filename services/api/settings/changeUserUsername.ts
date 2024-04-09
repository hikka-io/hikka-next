import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    username,
    auth,
}: {
    username: string;
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/username`,
        method: 'put',
        auth,
        params: { username },
        enqueueError: true,
    });
}
