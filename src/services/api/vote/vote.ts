import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export interface Params {
    slug: string;
    content_type: API.ContentType;
    score: 0 | -1 | 1;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/vote/${params?.content_type}/${params?.slug}`,
        method: 'put',
        params: { score: params?.score },
    });
}
