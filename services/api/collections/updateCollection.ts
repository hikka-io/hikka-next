import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Collection {}

type Request = {
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
    private: boolean;
    spoiler: boolean;
    nsfw: boolean;
    secret: string;
    reference: string;
};

export default async function req({
    secret,
    reference,
    ...params
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections/${reference}`,
        method: 'put',
        params: params,
        secret,
    });
}
