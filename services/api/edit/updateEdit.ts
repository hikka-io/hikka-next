import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Edit {}

export interface Params {
    description?: string;
    after: Hikka.AnimeEditParams;
    edit_id: number;
    auto?: boolean;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/edit/${params?.edit_id}/update`,
        method: 'post',
        params: {
            after: params?.after,
            description: params?.description,
            auto: params?.auto,
        },
    });
}
