import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    ignored_notifications: API.NotificationType[];
}

export interface Params {
    ignored_notifications: API.NotificationType[];
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/settings/notifications`,
        method: 'put',
    });
}
