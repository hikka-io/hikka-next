import { VoteArgs, VoteContentType, VoteResponse } from '../types/vote';
import { BaseModule } from './base';

/**
 * Module for handling votes
 */
export class VoteModule extends BaseModule {
    /**
     * Get the current vote for content
     */
    public async getVote(
        contentType: VoteContentType,
        slug: string,
    ): Promise<VoteResponse> {
        return this.client.get<VoteResponse>(`/vote/${contentType}/${slug}`);
    }

    /**
     * Set vote for content
     */
    public async setVote(
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
