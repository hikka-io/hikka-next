import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Edit {}

export default async function req({
    auth,
    edit_id,
}: {
    auth: string;
    edit_id: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/${edit_id}/close`,
        method: 'post',
        auth,
    });
}