import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.Read {}

export interface Params {
    slug: string;
    content_type: 'manga' | 'novel';
    note?: string | null;
    chapters?: number | null;
    volumes?: number | null;
    rereads?: number | null;
    score?: number | null;
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
