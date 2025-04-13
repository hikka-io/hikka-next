import { VoteArgs, VoteContentTypeEnum, VoteResponse } from '../types/vote';
import { BaseModule } from './base';

/**
 * Module for handling votes
 */
export class VoteModule extends BaseModule {
    /**
     * Get the current vote for content
     */
    public async getVote(
        contentType: VoteContentTypeEnum,
        slug: string,
    ): Promise<VoteResponse> {
        return this.client.get<VoteResponse>(`/vote/${contentType}/${slug}`);
    }

    /**
     * Set vote for content
     */
    public async setVote(
        contentType: VoteContentTypeEnum,
        slug: string,
        args: VoteArgs,
    ): Promise<VoteResponse> {
        return this.client.put<VoteResponse>(
            `/vote/${contentType}/${slug}`,
            args,
        );
    }
}
