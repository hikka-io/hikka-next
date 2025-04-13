import { FranchiseResponse, RelatedContentTypeEnum } from '../types/related';
import { BaseModule } from './base';

/**
 * Module for handling related content
 */
export class RelatedModule extends BaseModule {
    /**
     * Get franchise information for a content
     */
    public async getFranchise(
        contentType: RelatedContentTypeEnum,
        slug: string,
    ): Promise<FranchiseResponse> {
        return this.client.get<FranchiseResponse>(
            `/related/${contentType}/${slug}/franchise`,
        );
    }
}
