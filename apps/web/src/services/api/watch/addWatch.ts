import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    note: string;
    score: number;
    episodes: number;
    status: API.WatchStatus;
}

export interface Params {
    slug: string;
    note?: string | null;
    score?: number | null;
    episodes?: number | null;
    rewatches?: number | null;
    status: API.WatchStatus;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/watch/${params?.slug}`,
        method: 'put',
        params: {
            note: params?.note,
            score: params?.score,
            episodes: params?.episodes,
            status: params?.status,
            rewatches: params?.rewatches,
        },
    });
}
