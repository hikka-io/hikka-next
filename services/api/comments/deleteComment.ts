import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Comment {}

export default async function req({
    reference,
    secret,
}: {
    secret: string;
    reference: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/${reference}`,
        method: 'delete',
        secret,
    });
}