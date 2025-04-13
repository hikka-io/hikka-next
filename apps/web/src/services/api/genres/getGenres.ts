import { fetchRequest } from '../fetchRequest';

interface Response {
    list: API.Genre[];
}

export default async function req(): Promise<Response> {
    return fetchRequest<Response>({
        path: `/genres`,
        method: 'get',
        config: {
            cache: 'force-cache',
        },
    });
}
