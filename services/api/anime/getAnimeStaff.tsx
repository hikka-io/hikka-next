import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    pagination: Hikka.Pagination;
    list: {
        person: Hikka.Person;
        roles: {
            name_ua: string;
            name_en: string;
            slug: string;
        }[];
    }[];
}

export default async function req({
    slug,
    page = 1,
    size = 15,
}: {
    slug: string;
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/anime/${slug}/staff`,
        method: 'get',
        page,
        size,
    });
}