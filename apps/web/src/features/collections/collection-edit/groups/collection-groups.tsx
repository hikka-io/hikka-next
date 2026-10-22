import type { FC } from 'react';

import { toast } from 'sonner';
import { useShallow } from 'zustand/shallow';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { Button } from '@/components/ui/button';
import { SearchModal } from '@/features/search';

import { useCollectionContext } from '../collection-provider';
import type { Item } from '../collection-store';
import CollectionDndContext from './collection-dnd-context';
import CollectionGroup from './collection-group';
import ItemEditor from './item-editor';

/** One search for every group: it adds to the group whose tile opened it. */
const TitleSearch: FC = () => {
    const groupId = useCollectionContext((state) => state.searchGroupId);
    const contentType = useCollectionContext((state) => state.content_type);
    const openSearch = useCollectionContext((state) => state.openSearch);
    const addItem = useCollectionContext((state) => state.addItem);

    return (
        <SearchModal
            open={groupId !== undefined}
            onOpenChange={(open) => !open && openSearch(undefined)}
            content_type={contentType}
            type="button"
            disableHotkey
            onClick={(content) => {
                if (groupId && !addItem(groupId, content as Item['content'])) {
                    toast.info('Цей тайтл уже є в колекції');
                }
            }}
        />
    );
};

const CollectionEditGroups: FC = () => {
    const groupIds = useCollectionContext(
        useShallow((state) => state.groups.map((group) => group.id)),
    );
    const addGroup = useCollectionContext((state) => state.addGroup);

    return (
        <>
            <div className="flex flex-col gap-8">
                <CollectionDndContext>
                    <div className="flex flex-col gap-8">
                        {groupIds.map((groupId) => (
                            <CollectionGroup key={groupId} groupId={groupId} />
                        ))}
                    </div>
                </CollectionDndContext>
                <Button variant="secondary" size="md" onClick={addGroup}>
                    <MaterialSymbolsAddRounded />
                    Додати групу
                </Button>
            </div>
            <TitleSearch />
            <ItemEditor />
        </>
    );
};

export default CollectionEditGroups;
