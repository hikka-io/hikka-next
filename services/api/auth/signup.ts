import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export default async function req(params: {
    email: string;
    username: string;
    password: string;
    captcha: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/auth/signup`,
        method: 'post',
        params: {
            email: params.email,
            username: params.username,
            password: params.password,
        },
        captcha: params.captcha,
    });
}
