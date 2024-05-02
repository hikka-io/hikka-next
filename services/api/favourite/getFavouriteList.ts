import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response<TContent = API.Content>
    extends API.WithPagination<
        {
            favourite_created: number;
        } & TContent
    > {}

export interface Params {
    username: string;
    content_type: API.ContentType;
}

export default async function req<TContent = API.Content>({
    page = 1,
    size = 15,
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response<TContent>> {
    return fetchRequest<Response<TContent>>({
        ...props,
        path: `/favourite/${params?.content_type}/${params?.username}/list`,
        method: 'post',
        page,
        size,
    });
}
