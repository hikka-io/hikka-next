import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Edit {}

export default async function req<TResponse = Response>({
    edit_id,
}: {
    edit_id: number;
}): Promise<TResponse> {
    return fetchRequest<TResponse>({
        path: `/edit/${edit_id}`,
        method: 'get',
    });
}