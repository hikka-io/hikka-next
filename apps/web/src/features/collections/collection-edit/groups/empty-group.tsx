import type { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';

import { useCollectionContext } from '../collection-provider';

type Props = {
    groupId: string;
};

/** A group with nothing in it yet: one wide target to add to or drop onto. */
const EmptyGroup: FC<Props> = ({ groupId }) => {
    const openSearch = useCollectionContext((state) => state.openSearch);
    const hasOtherGroups = useCollectionContext(
        (state) => state.groups.length > 1,
    );

    return (
        <button
            type="button"
            onClick={() => openSearch(groupId)}
            className="group/empty flex min-h-38 w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted p-6 text-center text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
            <MaterialSymbolsAddRounded className="size-8 transition-transform group-hover/empty:scale-110" />
            <span className="font-medium text-sm">Додати</span>
            {hasOtherGroups && (
                <span className="text-xs">
                    або перетягніть сюди з інших груп
                </span>
            )}
        </button>
    );
};

export default EmptyGroup;
