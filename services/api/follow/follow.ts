import config from '@/services/api/config';
import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    follow: boolean;
}

export default async function req({
    username,
    secret,
}: {
    username: string;
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/follow/${username}`,
        method: 'put',
        secret,
    });
}
