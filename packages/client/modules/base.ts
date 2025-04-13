import { HikkaClient } from '../client';

/**
 * Base class for all API modules
 */
export abstract class BaseModule {
    protected client: HikkaClient;

    constructor(client: HikkaClient) {
        this.client = client;
    }
}
