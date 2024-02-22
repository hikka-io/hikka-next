import { fetchRequest } from '@/services/api/fetchRequest';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export default async function req(params: {
    token: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/auth/activation`,
        method: 'post',
        params,
    });
}