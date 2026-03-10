import { HikkaClient, HikkaClientConfig } from '@hikka/client';

export function createHikkaClient(config?: HikkaClientConfig): HikkaClient {
    return new HikkaClient({ baseUrl: 'https://api.hikka.io', ...config });
}

export const getHikkaClient = createHikkaClient;
