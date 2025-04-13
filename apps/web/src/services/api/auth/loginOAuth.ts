import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

interface Response {
    secret: string;
    expiration: number;
    created: number;
}

export interface Params {
    provider: 'google';
    code: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/oauth/${params?.provider}`,
        method: 'post',
        params: { code: params?.code },
    });
}
