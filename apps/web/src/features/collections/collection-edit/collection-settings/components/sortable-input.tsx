import type React from 'react';
import type { FC } from 'react';

import { useSortable } from '@dnd-kit/react/sortable';

import MaterialSymbolsDeleteForever from '@/components/icons/material-symbols/MaterialSymbolsDeleteForever';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    index: number;
    value: string;
    onRemove: () => void;
};

const SortableInput: FC<Props> = ({ id, index, value, onRemove, ...props }) => {
    const { ref, handleRef } = useSortable({ id, index });

    return (
        <div ref={ref} className="flex items-center gap-2">
            <Input value={value} {...props} />
            <Button size="icon-md" variant="outline" onClick={onRemove}>
                <MaterialSymbolsDeleteForever />
            </Button>
            <Button ref={handleRef} size="icon-md" variant="outline">
                <MaterialSymbolsDragIndicator />
            </Button>
        </div>
    );
};

export default SortableInput;
