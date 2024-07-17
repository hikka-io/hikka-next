import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Params {
    reference: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<API.Comment> {
    return fetchRequest<API.Comment>({
        ...props,
        path: `/comments/thread/${params?.reference}`,
        method: 'get',
    });
}
