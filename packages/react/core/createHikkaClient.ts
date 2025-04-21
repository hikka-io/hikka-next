import { HikkaClient, HikkaClientConfig } from '@hikka/client';
import { cache } from 'react';

/**
 * Creates a HikkaClient instance.
 * This ensures a clean client is created for each request.
 *
 * @param config - The HikkaClient config
 * @returns A new HikkaClient instance
 */
export function createHikkaClient(config?: HikkaClientConfig): HikkaClient {
    return new HikkaClient({ baseUrl: 'https://api.hikka.io', ...config });
}

export const getHikkaClient = cache(createHikkaClient);
