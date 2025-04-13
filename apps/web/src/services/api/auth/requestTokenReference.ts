import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

interface Response {
    expiration: number;
    reference: string;
    redirect_url: string;
}

export interface Params {
    client_reference: string;
    scope: string[];
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        params: {
            scope: params?.scope,
        },
        path: `/auth/token/request/${params?.client_reference}`,
        method: 'post',
    });
}
