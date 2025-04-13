import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { FC } from 'react';

import MaterialSymbolsDeleteForever from '../../../../components/icons/material-symbols/MaterialSymbolsDeleteForever';
import MaterialSymbolsDragIndicator from '../../../../components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    value: string;
    onRemove: () => void;
}

const SortableInput: FC<Props> = ({ id, value, onRemove, ...props }) => {
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
