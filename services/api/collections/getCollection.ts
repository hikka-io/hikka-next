import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Collection {}

type Request = {
    auth?: string;
    reference: string;
};

export default async function req({
    auth,
    reference,
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections/${reference}`,
        method: 'get',
        auth,
    });
}
