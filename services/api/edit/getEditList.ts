import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Edit> {}

export default async function req({
    page = 1,
    size = 15,
    ...params
}: {
    page?: number;
    size?: number;
    sort?: string[];
    status?: API.EditStatus;
    content_type?: API.ContentType;
    slug?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/list`,
        method: 'post',
        params,
        page,
        size,
    });
}
