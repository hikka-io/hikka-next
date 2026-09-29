import { type Client, createRequestClient } from '@hikka/api';

import { getInternalApiUrl, PUBLIC_API_URL } from './base-url';

export function createServerHikkaClient(clientIp?: string): Client {
    return createRequestClient({
        baseUrl: PUBLIC_API_URL,
        internalBaseUrl: getInternalApiUrl(),
        clientIp,
    });
}
