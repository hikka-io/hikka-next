import React from 'react';
import MaterialSymbolsDeleteForever from '~icons/material-symbols/delete-forever';
import MaterialSymbolsDragIndicator from '~icons/material-symbols/drag-indicator';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    value: string;
    onRemove: () => void;
}

const SortableInput = ({ id, value, onRemove, ...props }: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2">
            <Input value={value} {...props} />
            <Button size="icon" variant="outline" onClick={onRemove}>
                <MaterialSymbolsDeleteForever />
            </Button>
            <Button size="icon" variant="outline" {...listeners}>
                <MaterialSymbolsDragIndicator />
            </Button>
        </div>
    );
};

export default SortableInput;
