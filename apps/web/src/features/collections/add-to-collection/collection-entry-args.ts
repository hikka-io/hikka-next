import type { CollectionArgs, CollectionResponse } from '@hikka/api';

import { newId } from '@/utils/new-id';

import {
    type CollectionStore,
    collectionState,
    createCollectionStore,
    type Item,
} from '../collection-edit/collection-store';

function editedArgs(
    collection: CollectionResponse,
    edit: (state: CollectionStore) => void,
): CollectionArgs {
    const store = createCollectionStore(
        collectionState({
            ...collection,
            collection: [...collection.collection].sort(
                (a, b) => a.order - b.order,
            ),
        }),
    );
    edit(store.getState());

    // labels_order lists every titled group, and the backend rejects a label no entry uses.
    const { groups, setGroups, getApiData } = store.getState();
    setGroups(groups.filter((group) => group.items.length > 0));

    return getApiData();
}

export function collectionArgsWithEntry(
    collection: CollectionResponse,
    slug: string,
    label?: string,
): CollectionArgs {
    return editedArgs(collection, (state) => {
        const title = label ?? null;
        let group = state.groups.find((candidate) => candidate.title === title);
        if (!group) {
            group = { id: newId(), title, items: [] };
            state.setGroups([...state.groups, group]);
        }
        state.addItem(group.id, { slug } as Item['content']);
    });
}

export function collectionArgsWithoutEntry(
    collection: CollectionResponse,
    slug: string,
): CollectionArgs {
    return editedArgs(collection, (state) => {
        for (const group of state.groups) state.removeItem(group.id, slug);
    });
}
