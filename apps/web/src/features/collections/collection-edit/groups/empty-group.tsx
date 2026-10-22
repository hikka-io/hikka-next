import type { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';

import { useCollectionContext } from '../collection-provider';

type Props = {
    groupId: string;
};

/** A group with no titles yet: one wide target to add to or drop onto. */
const EmptyGroup: FC<Props> = ({ groupId }) => {
    const openSearch = useCollectionContext((state) => state.openSearch);
    const hasOtherGroups = useCollectionContext(
        (state) => state.groups.length > 1,
    );

    return (
        <button
            type="button"
            onClick={() => openSearch(groupId)}
            className="group/empty flex min-h-38 w-full flex-col items-center justify-center gap-3 rounded-lg bg-secondary/40 p-6 text-center transition-colors hover:bg-accent"
        >
            <span className="flex size-10 items-center justify-center rounded-lg bg-secondary group-hover/empty:bg-background/40">
                <MaterialSymbolsAddRounded className="size-5" />
            </span>
            <span className="flex flex-col gap-1">
                <span className="font-medium text-sm">Додати тайтл</span>
                {hasOtherGroups && (
                    <span className="text-muted-foreground text-xs">
                        або перетягніть сюди з інших груп
                    </span>
                )}
            </span>
        </button>
    );
};

export default EmptyGroup;
