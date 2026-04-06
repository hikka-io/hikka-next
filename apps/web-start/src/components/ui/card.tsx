import { ComponentPropsWithoutRef, memo } from 'react';

import { cn } from '@/utils/cn';

interface Props extends ComponentPropsWithoutRef<'div'> {}

const Card = ({ children, className, ...props }: Props) => {
    return (
        <div
            className={cn(
                'border-border relative isolate flex flex-col gap-4 rounded-lg border p-4 will-change-transform',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default memo(Card);
