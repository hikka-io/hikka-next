import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Collection {}

export type Request = {
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
    auth: string;
};

export default async function req({
    auth,
    ...params
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections/create`,
        method: 'post',
        params: params,
        auth,
    });
}
