import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export default async function req({
    reference,
    secret,
    text,
}: {
    secret: string;
    reference: string;
    text: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/${reference}`,
        method: 'put',
        secret,
        params: { text },
    });
}