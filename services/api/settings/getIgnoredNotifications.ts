import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    ignored_notifications: API.NotificationType[];
}

export default async function req({
    auth,
}: {
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/notifications`,
        method: 'get',
        auth,
    });
}
