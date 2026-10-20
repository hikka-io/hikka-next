import type { ComponentProps, FC } from 'react';

import { Chip } from '@/components/ui/chip';

const ToggleChip: FC<ComponentProps<typeof Chip>> = ({
    selected,
    className,
    ...props
}) => {
    return (
        <Chip
            selected={selected}
            className={
                selected ? className : `bg-secondary/40 ${className ?? ''}`
            }
            {...props}
        />
    );
};

export default ToggleChip;
