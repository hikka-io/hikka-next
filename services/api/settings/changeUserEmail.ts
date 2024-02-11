import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    email,
    secret,
}: {
    email: string;
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/email`,
        method: 'put',
        secret,
        params: { email },
        enqueueError: true,
    });
}