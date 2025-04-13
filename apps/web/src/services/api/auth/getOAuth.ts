import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    url: string;
}

export interface Params {
    provider: 'google';
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/oauth/${params!.provider}`,
        method: 'get',
    });
}
