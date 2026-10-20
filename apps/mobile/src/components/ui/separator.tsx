import type { FC } from 'react';

import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

type Props = ViewProps & {
    orientation?: 'horizontal' | 'vertical';
};

const Separator: FC<Props> = ({
    className,
    orientation = 'horizontal',
    ...props
}) => {
    return (
        <View
            className={cn(
                'shrink-0 bg-border',
                orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
                className,
            )}
            {...props}
        />
    );
};

export { Separator };
