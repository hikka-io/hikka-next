import { fetchRequest } from '@/services/api/fetchRequest';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export default async function req(params: {
    password: string;
    token: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/auth/password/confirm`,
        method: 'post',
        params,
    });
}