import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Params {
    mal_ids: number[];
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<API.AnimeInfo[]> {
    return fetchRequest<API.AnimeInfo[]>({
        ...props,
        path: `/integrations/mal/anime`,
        method: 'post',
    });
}
