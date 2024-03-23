import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    email,
    auth,
}: {
    email: string;
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/email`,
        method: 'put',
        auth,
        params: { email },
        enqueueError: true,
    });
}