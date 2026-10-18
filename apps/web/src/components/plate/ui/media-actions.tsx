import type { ReactNode } from 'react';

import type { TElement } from 'platejs';
import { useRemoveNodeButton } from 'platejs/react';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import { Button } from '@/components/ui/button';

type Props = {
    element: TElement;
    /** Actions shown before the delete button. */
    children?: ReactNode;
};

/** Corner actions of a media node; pair with `group/media` (and `data-selected`) on its frame. */
export function MediaActions({ element, children }: Props) {
    const { props } = useRemoveNodeButton({ element });

    return (
        <div className="absolute top-2 right-2 z-30 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover/media:opacity-100 group-data-[selected=true]/media:opacity-100 pointer-coarse:opacity-100">
            {children}
            <Button
                variant="secondary"
                size="icon-sm"
                aria-label="Видалити"
                {...props}
            >
                <MaterialSymbolsDeleteForever />
            </Button>
        </div>
    );
}
