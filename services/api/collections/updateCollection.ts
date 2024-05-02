import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Collection {}

export interface Params {
    title: string;
    tags: string[];
    content: {
        comment: string | null;
        label: string | null;
        order: number;
        slug: string;
    }[];
    content_type: API.ContentType;
    description: string;
    labels_order: string[];
    visibility: 'private' | 'public' | 'unlisted';
    spoiler: boolean;
    nsfw: boolean;
    reference: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/collections/${params?.reference}`,
        method: 'put',
        params: params,
    });
}
