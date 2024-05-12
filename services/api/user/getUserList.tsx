import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends Array<API.User> {}

export interface Params {
    query?: string;
}

export default async function req({
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/user/list`,
        method: 'post',
    });
}
