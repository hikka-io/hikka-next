import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Edit {}

export interface Params {
    edit_id: number;
}

export default async function req<TResponse = Response>({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<TResponse> {
    return fetchRequest<TResponse>({
        ...props,
        path: `/edit/${params?.edit_id}`,
        method: 'get',
    });
}
