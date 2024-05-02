import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response {
    reference: string;
    created: number;
    anime: API.Anime;
}

export interface Params {
    slug: string;
    content_type: API.ContentType;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/favourite/${params?.content_type}/${params?.slug}`,
        method: 'get',
    });
}
