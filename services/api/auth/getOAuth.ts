import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    url: string;
}

export default async function req({
    provider,
}: {
    provider: 'google';
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/auth/oauth/${provider}`,
        method: 'get',
    });
}
