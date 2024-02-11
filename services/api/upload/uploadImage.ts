import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    url: string;
}

export default async function req({
    file,
    upload_type,
    secret,
}: {
    file: File;
    upload_type: 'avatar' | 'cover';
    secret: string;
}): Promise<Response> {
    let data = new FormData();
    data.append('file', file);

    return fetchRequest<Response>({
        path: `/upload/${upload_type}`,
        method: 'put',
        secret: secret,
        params: data,
        formData: true,
    });
}