import type { FC } from 'react';

import { DEFAULT_CONTAINER_RATIO } from '@hikka/core';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { AspectRatio } from '@/components/ui/aspect-ratio';

import { useCollectionContext } from '../collection-provider';

type Props = {
    groupId: string;
};

/** The last tile of a group's grid, poster-sized so the grid keeps its rhythm. */
const AddTitleTile: FC<Props> = ({ groupId }) => {
    const openSearch = useCollectionContext((state) => state.openSearch);

    return (
        <button
            type="button"
            onClick={() => openSearch(groupId)}
            className="group/add flex flex-col text-left"
        >
            <AspectRatio
                ratio={DEFAULT_CONTAINER_RATIO}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-md bg-secondary/40 text-muted-foreground transition-colors group-hover/add:bg-accent group-hover/add:text-foreground"
            >
                <MaterialSymbolsAddRounded className="size-7" />
                <span className="font-medium text-sm">Додати тайтл</span>
            </AspectRatio>
        </button>
    );
};

export default AddTitleTile;
