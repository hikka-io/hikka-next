import { FetchRequestProps, fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    ignored_notifications: API.NotificationType[];
}

export default async function req(
    props?: FetchRequestProps,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/settings/notifications`,
        method: 'get',
    });
}
