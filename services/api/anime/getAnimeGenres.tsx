import { fetchRequest } from '@/services/api/fetchRequest';

interface Response {
    list: API.Genre[];
}

export default async function req(): Promise<Response> {
    return fetchRequest<Response>({
        path: `/anime/genres`,
        method: 'get',
        config: {
            next: {
                revalidate: false,
            },
        },
    });
}
