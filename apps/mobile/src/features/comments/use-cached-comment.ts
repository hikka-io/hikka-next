import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { CommentResponse } from '@hikka/api';
import { COMMENT_LIST_IDS, queryId } from '@hikka/core';

type Pages = { pages?: { list?: CommentResponse[] }[] };

const LIST_IDS = new Set<string>(COMMENT_LIST_IDS);

/**
 * The comment a reply or an edit starts from, read once from the comment lists already
 * in the cache (the composer always opens from one of them). `null` when none holds it.
 */
export function useCachedComment(reference: string | undefined) {
    const queryClient = useQueryClient();

    const [comment] = useState<CommentResponse | null>(() => {
        if (!reference) return null;

        const cached = queryClient.getQueriesData<Pages>({
            predicate: (query) => LIST_IDS.has(queryId(query.queryKey) ?? ''),
        });

        for (const [, data] of cached) {
            for (const page of data?.pages ?? []) {
                const found = page.list?.find(
                    (item) => item.reference === reference,
                );
                if (found) return found;
            }
        }

        return null;
    });

    return comment;
}
