import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Params {
    username: string;
    content_type: 'manga' | 'novel';
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Record<API.ReadStatus, number>> {
    return fetchRequest<Record<API.ReadStatus, number>>({
        ...props,
        path: `/read/${params?.content_type}/${params?.username}/stats`,
        method: 'get',
    });
}
