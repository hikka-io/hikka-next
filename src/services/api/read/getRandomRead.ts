import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Manga {}

export interface Params {
    username: string;
    status: API.ReadStatus;
    content_type: 'manga' | 'novel';
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/read/${params?.content_type}/random/${params?.username}/${params?.status}`,
        method: 'get',
    });
}
