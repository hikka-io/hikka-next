import type { FC } from 'react';

import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

const SURFACE_VARIANTS = {
    surface: 'border-border bg-surface shadow-card',
    inset: 'border-surface-inset-border bg-surface-inset',
    plain: 'border-border',
} as const;

type Props = ViewProps & {
    variant?: keyof typeof SURFACE_VARIANTS;
};

const Card: FC<Props> = ({ className, variant = 'surface', ...props }) => {
    return (
        <View
            className={cn(
                'flex-col gap-4 rounded-lg border p-4',
                SURFACE_VARIANTS[variant],
                className,
            )}
            {...props}
        />
    );
};

export default Card;
