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
    password: string;
    token: string;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/password/confirm`,
        method: 'post',
    });
}
