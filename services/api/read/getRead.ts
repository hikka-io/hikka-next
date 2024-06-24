import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Read {}

export interface Params {
    slug: string;
    content_type: 'manga' | 'novel';
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/read/${params?.content_type}/${params?.slug}`,
        method: 'get',
    });
}
