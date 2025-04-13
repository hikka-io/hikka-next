import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.Watch {}

export interface Params {
    slug: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/watch/${params?.slug}`,
        method: 'get',
    });
}
