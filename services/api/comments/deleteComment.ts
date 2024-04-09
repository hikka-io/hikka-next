import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export default async function req({
    reference,
    auth,
}: {
    auth: string;
    reference: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/${reference}`,
        method: 'delete',
        auth,
    });
}
