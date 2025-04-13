import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export interface Params {
    token: string;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/activation`,
        method: 'post',
    });
}
