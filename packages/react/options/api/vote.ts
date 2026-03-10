import { HikkaClient } from '@hikka/client';
import { queryOptions } from '@tanstack/react-query';

import { queryKeys } from '@/core';
import { UseVoteStatusParams } from '@/types/vote';

export function contentVoteOptions(
    client: HikkaClient,
    { contentType, slug }: UseVoteStatusParams,
) {
    return queryOptions({
        queryKey: queryKeys.vote.status(contentType, slug),
        queryFn: () => client.vote.getContentVote(contentType, slug),
    });
}
