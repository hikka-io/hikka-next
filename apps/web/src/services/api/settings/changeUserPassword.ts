import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    description: string;
}

export interface Params {
    password: string;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/settings/password`,
        method: 'put',
    });
}
