import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    result: boolean;
}

export default async function req({
    reference,
    secret,
}: {
    reference: string;
    secret?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/notifications/${reference}/seen`,
        method: 'post',
        secret,
    });
}
