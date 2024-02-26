import React, { HTMLAttributes } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import BaseCard from '@/components/ui/base-card';
import { Input } from '@/components/ui/input';

interface Props extends HTMLAttributes<HTMLInputElement> {
    id: string;
    value: string;
}

const Component = (props: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Input {...props} />
        </div>
    );
};

export default Component;
