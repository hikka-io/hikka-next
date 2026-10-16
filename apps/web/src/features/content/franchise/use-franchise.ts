import { useQuery } from '@tanstack/react-query';

import type { FranchiseResponse, MainContentTypeEnum } from '@hikka/api';

import { contentRelatedFranchiseOptions } from '../queries';
import { buildFranchiseModel } from './franchise-model';

export function useFranchise(
    contentType: MainContentTypeEnum,
    slug: string,
    enabled = true,
) {
    return useQuery({
        ...contentRelatedFranchiseOptions(contentType, slug),
        enabled,
        select: (data: FranchiseResponse) =>
            buildFranchiseModel(data, contentType, slug),
    });
}
