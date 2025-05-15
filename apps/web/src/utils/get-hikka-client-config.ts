import { DEFAULT_CACHE_CONTROL, HikkaClientConfig } from '@hikka/client';
import { cache } from 'react';

import { getCookie } from './cookies';

export const createHikkaClientConfig = async (
    config?: HikkaClientConfig,
): Promise<HikkaClientConfig> => {
    return {
        baseUrl: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
        authToken: await getCookie('auth'),
        cacheControl: DEFAULT_CACHE_CONTROL,
        ...config,
    };
};

export const getHikkaClientConfig = cache(createHikkaClientConfig);

export default getHikkaClientConfig;
