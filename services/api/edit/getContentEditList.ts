import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.WithPagination<Hikka.Edit> {}

export default async function req({
    content_type,
    slug,
    page = 1,
    size = 15,
}: {
    content_type: Hikka.ContentType;
    slug: string;
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/${content_type}/${slug}/list`,
        method: 'get',
        page,
        size,
    });
}