import { BaseRequestOptionsArgs } from '../types';
import { FranchiseResponse, RelatedContentType } from '../types/related';
import { BaseModule } from './base';

/**
 * Module for handling related content
 */
export class RelatedModule extends BaseModule {
    /**
     * Get franchise information for a content
     */
    public async getFranchise(
        contentType: RelatedContentType,
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<FranchiseResponse> {
        return this.client.get<FranchiseResponse>(
            `/related/${contentType}/${slug}/franchise`,
            options,
        );
    }
}
