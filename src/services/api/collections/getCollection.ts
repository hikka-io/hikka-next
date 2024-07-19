import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Collection<API.MainContent> {}

export interface Params {
    reference: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/collections/${params?.reference}`,
        method: 'get',
    });
}
