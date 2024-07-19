import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

interface Response extends API.User {}

export interface Params {
    email: string;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/auth/password/reset`,
        method: 'post',
    });
}
