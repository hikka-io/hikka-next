import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.ClientInfo {}

export interface Params {
    client_reference: string;
    name: string;
    description: string;
    endpoint: string;
    revoke_secret: boolean;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/client/${params?.client_reference}`,
        method: 'put',
        params: {
            name: params?.name,
            description: params?.description,
            endpoint: params?.endpoint,
            revoke_secret: params?.revoke_secret,
        },
    });
}
