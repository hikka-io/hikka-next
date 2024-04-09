import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    follow: boolean;
}

export default async function req({
    username,
    auth,
}: {
    username: string;
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/follow/${username}`,
        method: 'delete',
        auth,
    });
}
