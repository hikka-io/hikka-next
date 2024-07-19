import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Edit {}

export interface Params {
    description?: string;
    content_type: API.ContentType;
    after: Hikka.AnimeEditParams;
    slug: string;
    auto?: boolean;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/edit/${params?.content_type}/${params?.slug}`,
        method: 'put',
        params: {
            after: params?.after,
            description: params?.description,
            auto: params?.auto,
        },
    });
}
