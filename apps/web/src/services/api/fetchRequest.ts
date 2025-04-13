import { getCookie } from '@/utils/cookies';
import config from './config';

// Types
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface BaseFetchRequestProps<
    TParams = Record<string, any> | FormData,
> {
    params?: TParams;
    page?: number;
    size?: number;
    captcha?: string;
    formData?: boolean;
    config?: Record<string, any>;
    auth?: string;
}

export interface FetchRequestProps<TParams = Record<string, any> | FormData>
    extends BaseFetchRequestProps<TParams> {
    path: string;
    method: HttpMethod;
    signal?: AbortSignal;
}

// Utility functions
function buildPaginationParams({
    page,
    size,
}: Pick<BaseFetchRequestProps, 'page' | 'size'>): URLSearchParams {
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (size) params.set('size', String(size));
    return params;
}

function buildQueryParams(
    method: HttpMethod,
    params?: Record<string, any>,
): string {
    if (method.toLowerCase() !== 'get' || !params) return '';
    return '&' + new URLSearchParams(params).toString();
}

function buildRequestBody(
    method: HttpMethod,
    params?: Record<string, any> | FormData,
    isFormData = false,
): BodyInit | undefined {
    if (method.toLowerCase() === 'get' || !params) return undefined;
    return isFormData ? (params as FormData) : JSON.stringify(params);
}

async function buildHeaders(
    options: Pick<BaseFetchRequestProps, 'captcha' | 'auth'>,
    isFormData: boolean,
): Promise<HeadersInit> {
    const headers: Record<string, string> = {
        // Only include default content-type header if not FormData
        ...(isFormData ? {} : config.config.headers),
        captcha: options.captcha || '',
    };

    // Add auth header for server-side requests
    if (typeof window === 'undefined') {
        headers.auth = (options.auth || (await getCookie('auth')))!;
    } else {
        if (process.env.NEXT_PUBLIC_DEV === 'true') {
            headers.auth = options.auth || (await getCookie('auth'))!;
        }
    }

    return headers;
}

async function handleResponse<TResponse>(
    response: Response,
): Promise<TResponse> {
    if (!response.ok) {
        if (response.status >= 400 && response.status <= 499) {
            throw await response.json();
        }
        console.error(response);
        throw new Error(
            `Request failed: ${response.status} ${response.statusText}`,
        );
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    }
    return response.text() as unknown as TResponse;
}

// Main fetch request function
export async function fetchRequest<TResponse>({
    path,
    method,
    params,
    page,
    size,
    captcha,
    formData = false,
    config: customConfig,
    auth,
    signal,
}: FetchRequestProps): Promise<TResponse> {
    // Build URL
    const paginationParams = buildPaginationParams({ page, size });
    const queryParams = buildQueryParams(method, params as Record<string, any>);
    const url = `${config.baseAPI}${path}?${paginationParams}${queryParams}`;

    // Build request options
    const headers = await buildHeaders({ captcha, auth }, formData);
    const body = buildRequestBody(method, params, formData);

    // Make request
    const response = await fetch(url, {
        method: method.toUpperCase(),
        credentials: 'include',
        body,
        cache: customConfig ? undefined : 'no-store',
        ...config.config, // Apply base config
        ...customConfig, // Apply custom config
        headers, // Apply headers last to ensure proper overwrites
        signal,
    });

    return handleResponse<TResponse>(response);
}

export type { HttpMethod };
