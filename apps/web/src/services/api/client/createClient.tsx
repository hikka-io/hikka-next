import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.ClientInfo {}

export interface Params {
    name: string;
    description: string;
    endpoint: string;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/client`,
        method: 'post',
    });
}
