import React, { HTMLAttributes } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import BaseCard from '@/components/ui/base-card';
import { Button } from '@/components/ui/button';

import MaterialSymbolsDragIndicator from '~icons/material-symbols/drag-indicator'
import MaterialSymbolsDeleteForever from '~icons/material-symbols/delete-forever'

interface Props extends HTMLAttributes<HTMLDivElement> {
    id: string;
    anime: API.Anime;
    onRemove: () => void;
}

const Component = ({ id, anime, onRemove }: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} >
            <BaseCard
                poster={anime.poster}
                title={anime.title_ua || anime.title_en || anime.title_ja}
            >
                <div className="absolute left-0 bottom-0 w-full">
                    <div className="absolute bottom-2 right-2 flex gap-2 z-[1]">
                        <Button size="icon-sm" variant="secondary" onClick={onRemove}>
                            <MaterialSymbolsDeleteForever />
                        </Button>
                        <Button size="icon-sm" variant="secondary" {...listeners}>
                            <MaterialSymbolsDragIndicator />
                        </Button>
                    </div>
                    <div className="absolute left-0 bottom-0 z-0 h-16 w-full bg-gradient-to-t from-black to-transparent" />
                </div>
            </BaseCard>
        </div>
    );
};

export default Component;
