import { getCookie } from '@/utils/cookies';

import config from './config';

export interface BaseFetchRequestProps<
    TParams extends Record<string, any> | FormData =
        | Record<string, any>
        | FormData,
> {
    params?: TParams;
    page?: number;
    size?: number;
    captcha?: string;
    formData?: boolean;
    config?: Record<string, any>;
    auth?: string;
}

export interface FetchRequestProps<
    TParams extends Record<string, any> | FormData =
        | Record<string, any>
        | FormData,
> extends BaseFetchRequestProps<TParams> {
    path: string;
    method: string;
}

export async function fetchRequest<TResponse>({
    path,
    method,
    params,
    page,
    size,
    captcha,
    formData,
    config: myConfig,
    auth,
}: FetchRequestProps): Promise<TResponse> {
    const paginationParams = new URLSearchParams({
        ...(page ? { page: String(page) } : {}),
        ...(size ? { size: String(size) } : {}),
    }).toString();

    const queryParams =
        (method === 'get' &&
            params &&
            '&' +
                new URLSearchParams(
                    params as Record<string, string>,
                ).toString()) ||
        '';

    const input = config.baseAPI + path + '?' + paginationParams + queryParams;

    const res = await fetch(input, {
        credentials: 'include',
        method: method,
        body:
            method !== 'get' && params
                ? formData
                    ? (params as FormData)
                    : JSON.stringify(params)
                : undefined,
        ...(myConfig ? {} : { cache: 'no-store' }),
        ...config.config,
        ...myConfig,
        headers: {
            ...(formData ? {} : config.config.headers),
            captcha: captcha || '',
            ...(typeof window === 'undefined'
                ? { auth: auth || (await getCookie('auth')) }
                : {}),
        },
    });

    await handleError(res);

    return await res.json();
}

async function handleError(response: Response) {
    if (!response.ok) {
        if (response.status >= 400 && response.status <= 499) {
            throw await response.json();
        }
        throw new Error('Failed to fetch data');
    }
}
