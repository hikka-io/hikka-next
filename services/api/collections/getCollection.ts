import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Collection {}

type Request = {
    secret?: string;
    reference: string;
};

export default async function req({
    secret,
    reference,
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections/${reference}`,
        method: 'get',
        secret,
    });
}
