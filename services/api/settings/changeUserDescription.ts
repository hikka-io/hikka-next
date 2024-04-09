import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    description: string;
}

export default async function req({
    description,
    auth,
}: {
    description: string;
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/description`,
        method: 'put',
        auth,
        params: { description },
        enqueueError: true,
    });
}
