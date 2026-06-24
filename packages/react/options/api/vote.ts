import { queryOptions } from '@tanstack/react-query';

import type { HikkaClient } from '@hikka/client';

import type { UseVoteStatusParams } from '@/types/vote';
import { queryKeys } from '@/core';

export function contentVoteOptions(
    client: HikkaClient,
    { contentType, slug }: UseVoteStatusParams,
) {
    return queryOptions({
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: () => client.vote.getContentVote(contentType, slug),
    });
}
