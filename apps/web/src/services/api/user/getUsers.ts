import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Params {
    query?: string;
}

export default async function req({
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<API.User[]> {
    return fetchRequest<API.User[]>({
        ...props,
        path: `/user/list`,
        method: 'post',
        page,
        size,
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
