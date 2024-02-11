import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    description,
    secret,
}: {
    description: string;
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/description`,
        method: 'put',
        secret,
        params: { description },
        enqueueError: true,
    });
}