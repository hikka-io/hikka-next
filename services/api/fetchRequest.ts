import config from '@/services/api/config';
import getApiErrorMessage from '@/utils/getApiErrorMessage';
import SnackbarUtils from '@/utils/snackbar-utils';

interface Props {
    path: string;
    method: string;
    params?: Record<string, unknown> | FormData;
    secret?: string;
    page?: number;
    size?: number;
    captcha?: string;
    enqueueError?: boolean;
    formData?: boolean;
}

export async function fetchRequest<TResponse>({
    path,
    method,
    params,
    secret,
    page,
    size,
    captcha,
    enqueueError,
    formData,
}: Props): Promise<TResponse> {
    const paginationParams = new URLSearchParams(
        Object.fromEntries(
            [
                ['page', page],
                ['size', size],
            ].filter(([, value]) => value !== undefined),
        ),
    ).toString();

    const queryParams =
        (method === 'get' &&
            params &&
            '&' +
                new URLSearchParams(
                    params as Record<string, string>,
                ).toString()) ||
        '';

    const res = await fetch(
        config.baseAPI + path + '?' + paginationParams + queryParams,
        {
            method: method,
            body:
                method !== 'get' && params
                    ? formData
                        ? (params as FormData)
                        : JSON.stringify(params)
                    : undefined,
            ...config.config,
            headers: {
                ...(formData
                    ? {}
                    : config.config.headers),
                auth: secret || '',
                captcha: captcha || '',
            },
        },
    );

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            const error: API.Error = await res.json();

            if (enqueueError) {
                const errorMessage = getApiErrorMessage(error);

                errorMessage && SnackbarUtils.error(errorMessage);
            }

            throw error;
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
