import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    anime: API.Anime[];
    manga: API.Manga[];
    novel: API.Novel[];
}

export interface Params {
    slug: string;
    content_type: API.ContentType;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    const { content_type, slug } = params!;

    return fetchRequest<Response>({
        ...props,
        path: `/related/${content_type}/${slug}/franchise`,
        method: 'get',
    });
}
