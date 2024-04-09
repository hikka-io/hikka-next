import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    ignored_notifications: API.NotificationType[];
}

export default async function req({
    ignored_notifications,
    auth,
}: {
    auth: string;
    ignored_notifications: API.NotificationType[];
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/settings/notifications`,
        method: 'put',
        params: { ignored_notifications },
        auth,
    });
}
