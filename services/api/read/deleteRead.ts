import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response {
    success: boolean;
}

export interface Params {
    content_type: 'manga' | 'novel';
    slug: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/read/${params?.content_type}/${params?.slug}`,
        method: 'delete',
    });
}
