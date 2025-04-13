import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    reference: string;
    created: number;
}

export interface Params {
    slug: string;
    content_type: API.ContentType;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/favourite/${params?.content_type}/${params?.slug}`,
        method: 'put',
    });
}
