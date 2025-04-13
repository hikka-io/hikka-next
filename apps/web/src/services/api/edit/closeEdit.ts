import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.Edit {}

export interface Params {
    edit_id: number;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/edit/${params?.edit_id}/close`,
        method: 'post',
    });
}
