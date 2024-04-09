import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    password,
    auth,
}: {
    password: string;
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/password`,
        method: 'put',
        auth,
        params: { password },
        enqueueError: true,
    });
}
