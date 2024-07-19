import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Anime> {}

export interface Params {
    param: string;
}

export default async function req({
    params,
    page = 1,
    size = 15,
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/todo/anime/${params?.param}`,
        method: 'get',
        page,
        size,
    });
}
