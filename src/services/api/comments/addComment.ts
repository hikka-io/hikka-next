import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export interface Params {
    slug: string;
    content_type: API.ContentType;
    text: string;
    parent?: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/comments/${params?.content_type}/${params?.slug}`,
        method: 'put',
        params: { text: params?.text, parent: params?.parent },
    });
}
