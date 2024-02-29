import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Collection {}

export type Request = {
    title: string;
    tags: string[];
    content: {
        comment: string;
        label: string;
        order: number;
        slug: string;
    }[];
    content_type: API.ContentType;
    description: string;
    labels_order: string[];
    private: boolean;
    spoiler: boolean;
    nsfw: boolean;
    secret: string;
};

export default async function req({
    secret,
    ...params
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections/create`,
        method: 'post',
        params: params,
        secret,
    });
}
