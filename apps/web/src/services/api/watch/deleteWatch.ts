import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    success: boolean;
}

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
        method: 'delete',
    });
}
