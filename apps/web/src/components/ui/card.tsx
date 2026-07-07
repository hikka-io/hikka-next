import { type ComponentPropsWithoutRef, memo } from 'react';

import { cn } from '@/utils/cn';

type Variant = 'surface' | 'solid' | 'inset' | 'glass' | 'plain';

type Props = ComponentPropsWithoutRef<'div'> & { variant?: Variant };

const VARIANTS: Record<Variant, string> = {
    surface: 'surface',
    solid: 'surface-solid',
    inset: 'surface-inset',
    glass: 'surface-glass',
    plain: '',
};

const Card = ({
    children,
    className,
    variant = 'surface',
    ...props
}: Props) => {
    return (
        <div
            className={cn(
                'relative isolate flex flex-col gap-4 rounded-lg border border-border p-4 will-change-transform',
                VARIANTS[variant],
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default memo(Card);
