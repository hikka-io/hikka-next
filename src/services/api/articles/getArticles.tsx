import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Article> {}

export interface Params {
    slug: string;
    page?: number;
    size?: number;
    sort?: string;
    author?: string;
    draft?: boolean;
}

export default async function req({
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/articles`,
        method: 'post',
    });
}
