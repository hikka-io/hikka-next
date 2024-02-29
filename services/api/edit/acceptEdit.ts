import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Edit {}

export default async function req({
    secret,
    edit_id,
}: {
    secret: string;
    edit_id: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/${edit_id}/accept`,
        method: 'post',
        secret,
    });
}