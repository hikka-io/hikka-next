import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.Client {}

export interface Params {
    client_reference: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/client/${params?.client_reference}/verify`,
        method: 'post',
    });
}
