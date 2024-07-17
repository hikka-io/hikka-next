import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<CharacterNovel> {}

export type CharacterNovel = {
    main: boolean;
    novel: API.Novel;
};

export interface Params {
    slug: string;
}

export default async function req({
    params,
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/characters/${params?.slug}/novel`,
        method: 'get',
        page,
        size,
    });
}
