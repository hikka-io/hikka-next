import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Params {
    username: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<API.Activity[]> {
    return fetchRequest<API.Activity[]>({
        ...props,
        path: `/user/${params?.username}/activity`,
        method: 'get',
    });
}
