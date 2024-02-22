import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Comment {}

export default async function req({
    secret,
    score,
    reference,
}: {
    secret: string;
    reference: string;
    score: 0 | -1 | 1;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/vote/${reference}`,
        method: 'put',
        secret,
        params: { score },
    });
}