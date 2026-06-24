import type { BaseRequestOptionsArgs } from '../types/common';
import type { FeedArgs, FeedItemResponse } from '../types/feed';
import { BaseModule } from './base';

/**
 * Module for handling feed
 */
export class FeedModule extends BaseModule {
    /**
     * Get feed items with optional filtering
     */
    public async getFeed(
        args: FeedArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<FeedItemResponse[]> {
        return this.client.post<FeedItemResponse[]>('/feed', args, options);
    }
}
