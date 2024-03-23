import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    url: string;
}

export default async function req({
    file,
    upload_type,
    auth,
}: {
    file: File;
    upload_type: 'avatar' | 'cover';
    auth: string;
}): Promise<Response> {
    let data = new FormData();
    data.append('file', file);

    return fetchRequest<Response>({
        path: `/upload/${upload_type}`,
        method: 'put',
        auth: auth,
        params: data,
        formData: true,
    });
}