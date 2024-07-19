import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export interface Params {
    email: string;
    username: string;
    password: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/signup`,
        method: 'post',
        params: {
            email: params?.email,
            username: params?.username,
            password: params?.password,
        },
    });
}
