import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Read {}

export interface Params {
    slug: string;
    content_type: 'manga' | 'novel';
    note?: string;
    chapters?: number;
    volumes?: number;
    rereads?: number;
    score?: number;
    status: API.ReadStatus;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    const { slug, content_type, ...restParams } = params!;

    return fetchRequest<Response>({
        ...props,
        path: `/read/${content_type}/${slug}`,
        method: 'put',
        params: restParams,
    });
}
