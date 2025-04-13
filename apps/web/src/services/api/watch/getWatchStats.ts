import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Params {
    username: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<
    Record<API.WatchStatus | 'duration', number>
> {
    return fetchRequest<Record<API.WatchStatus | 'duration', number>>({
        ...props,
        path: `/watch/${params?.username}/stats`,
        method: 'get',
    });
}
