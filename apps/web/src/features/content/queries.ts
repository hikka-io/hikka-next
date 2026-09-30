import {
    type Client,
    contentFranchiseOptions,
    type RelatedContentTypeEnum,
} from '@hikka/api';

export const franchiseOptions = (
    content_type: RelatedContentTypeEnum,
    slug: string,
    client?: Client,
) => contentFranchiseOptions({ path: { slug, content_type }, client });
