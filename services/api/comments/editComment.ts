import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export default async function req({
    reference,
    auth,
    text,
}: {
    auth: string;
    reference: string;
    text: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/${reference}`,
        method: 'put',
        auth,
        params: { text },
    });
}