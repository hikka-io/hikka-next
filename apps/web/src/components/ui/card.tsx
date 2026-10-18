import { type ComponentProps, memo } from 'react';

import {
    SURFACE_CLASS_NAME,
    SURFACE_VARIANTS,
    type SurfaceVariant,
} from '@/components/ui/surface';
import { cn } from '@/utils/cn';

type Props = ComponentProps<'div'> & { variant?: SurfaceVariant };

const Card = ({
    children,
    className,
    variant = 'surface',
    ...props
}: Props) => {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 p-4',
                SURFACE_CLASS_NAME,
                SURFACE_VARIANTS[variant],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default memo(Card);
