import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    success: boolean;
}

export interface Params {
    overwrite: boolean;
    anime: Record<string, any>[];
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/settings/import/watch`,
        method: 'post',
    });
}
