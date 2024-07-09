import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Params {
    sort?: string;
    target_type?: API.ModerationType;
    author?: string;
}

export interface Response extends API.WithPagination<API.Moderation> {}

export default async function req({
    page = 1,
    size = 15,
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/moderation/log`,
        method: 'post',
        params,
        page,
        size,
    });
}
