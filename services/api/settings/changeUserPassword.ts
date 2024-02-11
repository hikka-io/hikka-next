import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    password,
    secret,
}: {
    password: string;
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/password`,
        method: 'put',
        secret,
        params: { password },
        enqueueError: true,
    });
}