import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
    addCollectionContentMutation,
    deleteCollectionContentMutation,
    type UserCollectionResponse,
} from '@hikka/api';

import {
    applyUserCollectionChange,
    invalidateCollections,
} from '@/utils/api/invalidate-content-state';

export function useUpdateCollectionEntry(reference: string, slug: string) {
    const queryClient = useQueryClient();
    const path = { reference, slug };

    const callbacks = {
        onSuccess: (saved: UserCollectionResponse) =>
            applyUserCollectionChange(queryClient, slug, saved),
        // A rejected change (already added, already removed, limits) means the picker was stale.
        onError: () => invalidateCollections(queryClient),
    };

    const add = useMutation({
        ...addCollectionContentMutation(),
        ...callbacks,
    });
    const remove = useMutation({
        ...deleteCollectionContentMutation(),
        ...callbacks,
    });

    return {
        isPending: add.isPending || remove.isPending,
        add: (label: string | undefined, onDone: () => void) =>
            add.mutate({ path, body: { label } }, { onSuccess: onDone }),
        remove: (onDone: () => void) =>
            remove.mutate({ path }, { onSuccess: onDone }),
    };
}
