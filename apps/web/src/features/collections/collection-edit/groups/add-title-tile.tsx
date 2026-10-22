import type { FC } from 'react';

import { DEFAULT_CONTAINER_RATIO } from '@hikka/core';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { AspectRatio } from '@/components/ui/aspect-ratio';

import { useCollectionContext } from '../collection-provider';

type Props = {
    groupId: string;
};

/** The last card of a group: an empty poster with a title, like the cards before it. */
const AddTitleTile: FC<Props> = ({ groupId }) => {
    const openSearch = useCollectionContext((state) => state.openSearch);

    return (
        <button
            type="button"
            onClick={() => openSearch(groupId)}
            className="group/add flex w-full flex-col gap-2 text-left text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground"
        >
            <AspectRatio
                ratio={DEFAULT_CONTAINER_RATIO}
                className="flex w-full items-center justify-center rounded-md bg-muted group-focus-visible/add:ring-[3px] group-focus-visible/add:ring-ring/50"
            >
                <MaterialSymbolsAddRounded className="size-8 transition-transform group-hover/add:scale-110" />
            </AspectRatio>
            <span className="font-medium text-sm leading-5">Додати</span>
        </button>
    );
};

export default AddTitleTile;
