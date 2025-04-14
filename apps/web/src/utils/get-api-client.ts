import { HikkaClient, HikkaClientConfig } from '@hikka/client';
import { cache } from 'react';

import { getCookie } from './cookies';

export const createAPIClient = (config?: HikkaClientConfig) => {
    return new HikkaClient({
        baseUrl: (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL)!,
        ...config,
    });
};

const getAPIClient = cache(async () =>
    createAPIClient({
        baseUrl: (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL)!,
        authToken: await getCookie('auth'),
    }),
);

export default getAPIClient;
