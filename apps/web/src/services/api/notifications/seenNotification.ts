import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    result: boolean;
}

export interface Params {
    reference: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/notifications/${params?.reference}/seen`,
        method: 'post',
    });
}
