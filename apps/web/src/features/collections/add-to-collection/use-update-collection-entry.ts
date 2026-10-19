import {
    type QueryKey,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';

import { getCollection, updateCollection } from '@hikka/api';

import { applyCollectionEntryChange } from '@/utils/api/invalidate-content-state';

import {
    collectionArgsWithEntry,
    collectionArgsWithoutEntry,
} from './collection-entry-args';
import { COLLECTION_MAX_ENTRIES, COLLECTION_MIN_ENTRIES } from './constants';

type Variables = {
    add: boolean;
    label?: string;
};

export function useUpdateCollectionEntry(
    reference: string,
    slug: string,
    membershipKey: QueryKey,
) {
    const queryClient = useQueryClient();

    return useMutation({
        // The PUT replaces every entry, so it is built from a fresh read, never from the 6-entry list preview.
        mutationFn: async ({ add, label }: Variables) => {
            const { data: collection } = await getCollection({
                path: { reference },
                throwOnError: true,
            });
            const entries = collection.collection.length;
            const present = collection.collection.some(
                (entry) => entry.content.slug === slug,
            );

            if (add === present) return collection;
            if (add && entries >= COLLECTION_MAX_ENTRIES) {
                throw new Error(
                    `У колекції вже ${COLLECTION_MAX_ENTRIES} позицій`,
                );
            }
            if (!add && entries <= COLLECTION_MIN_ENTRIES) {
                throw new Error('Колекція не може бути порожньою');
            }

            const { data } = await updateCollection({
                path: { reference },
                body: add
                    ? collectionArgsWithEntry(collection, slug, label)
                    : collectionArgsWithoutEntry(collection, slug),
                throwOnError: true,
            });
            return data;
        },
        // Settled, not success: a rejected change means the lists were stale, so they refresh either way.
        onSettled: () => applyCollectionEntryChange(queryClient, membershipKey),
    });
}
