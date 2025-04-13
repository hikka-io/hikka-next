import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    description: string;
}

export interface Params {
    username: string;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/settings/username`,
        method: 'put',
    });
}
