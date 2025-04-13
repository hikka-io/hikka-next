//
import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.User {}

export interface Params {
    image_type: 'avatar' | 'cover';
}

export default async function req({
    params,
}: BaseFetchRequestProps<Params>): Promise<Response> {
    const { image_type } = params!;

    return fetchRequest<Response>({
        path: `/settings/image/${image_type}`,
        method: 'delete',
    });
}
