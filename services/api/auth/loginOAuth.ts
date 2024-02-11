import config from '@/services/api/config';
import { fetchRequest } from '@/services/api/fetchRequest';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export default async function req({
    provider,
    code,
}: {
    provider: 'google';
    code: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/auth/oauth/${provider}`,
        method: 'post',
        params: { code },
    });
}
