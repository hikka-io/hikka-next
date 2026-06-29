import { type ComponentPropsWithoutRef, memo } from 'react';

import { cn } from '@/utils/cn';

type Props = ComponentPropsWithoutRef<'div'>;

const Card = ({ children, className, ...props }: Props) => {
    return (
        <div
            className={cn(
                'relative isolate flex flex-col gap-4 rounded-lg border border-border p-4 will-change-transform',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default memo(Card);
