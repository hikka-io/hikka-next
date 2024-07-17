import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Company> {}

export interface Params {
    query?: string;
    type: API.CompanyType;
}

export default async function req({
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/companies`,
        method: 'post',
        page,
        size,
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
