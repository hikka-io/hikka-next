import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export interface Params {
    email: string;
    password: string;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/login`,
        method: 'post',
    });
}
