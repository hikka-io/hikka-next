import { ComponentPropsWithoutRef, memo } from 'react';

import { cn } from '@/utils/cn';

interface Props extends ComponentPropsWithoutRef<'div'> {}

const Card = ({ children, className, ...props }: Props) => {
    return (
        <div
            className={cn(
                'relative flex flex-col gap-4 rounded-lg border border-border p-4',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default memo(Card);
