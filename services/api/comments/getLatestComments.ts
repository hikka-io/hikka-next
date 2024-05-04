import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export type LatestComment = {
    author: API.User;
    updated: number;
    created: number;
    content_type: API.ContentType;
    image: string;
    text: string;
    vote_score: number;
    reference: string;
    depth: number;
    slug: string;
};

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<LatestComment[]> {
    return fetchRequest<LatestComment[]>({
        ...props,
        path: `/comments/latest`,
        method: 'get',
    });
}
