import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    success: boolean;
}

export interface Params {
    overwrite: boolean;
    content: Record<string, any>[];
}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/settings/import/read`,
        method: 'post',
    });
}
