import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    followers: number;
    following: number;
}

export interface Params {
    username: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/follow/${params?.username}/stats`,
        method: 'get',
    });
}
