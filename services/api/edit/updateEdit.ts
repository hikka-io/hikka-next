import config from '@/services/api/config';
import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Edit {}

export default async function req({
    secret,
    description,
    after,
    edit_id,
    captcha,
}: {
    secret: string;
    description?: string;
    after: Hikka.AnimeEditParams;
    edit_id: number;
    captcha: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/${edit_id}/update`,
        method: 'post',
        params: { after, description },
        secret,
        captcha,
    });
}
