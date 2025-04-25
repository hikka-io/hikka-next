import { VoteArgs, VoteContentType, VoteResponse } from '../types/vote';
import { BaseModule } from './base';

/**
 * Module for handling votes
 */
export class VoteModule extends BaseModule {
    /**
     * Get current vote for specific content
     */
    public async getContentVote(
        contentType: VoteContentType,
        slug: string,
    ): Promise<VoteResponse> {
        return this.client.get<VoteResponse>(`/vote/${contentType}/${slug}`);
    }

    /**
     * Create or update a vote for content
     */
    public async createVote(
        contentType: VoteContentType,
        slug: string,
        args: VoteArgs,
    ): Promise<VoteResponse> {
        return this.client.put<VoteResponse>(
            `/vote/${contentType}/${slug}`,
            args,
        );
    }
}
