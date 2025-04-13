import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.Collection<API.MainContent> {}

export interface Params {
    title: string;
    tags: string[];
    content: {
        comment: string | null;
        label: string | null;
        order: number;
        slug: string;
    }[];
    content_type: API.ContentType;
    description: string;
    labels_order: string[];
    visibility: 'private' | 'public' | 'unlisted';
    spoiler: boolean;
    nsfw: boolean;
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/collections/create`,
        method: 'post',
    });
}
