import { PropsWithChildren, memo } from 'react';

import { cn } from '@/utils/utils';

interface Props extends PropsWithChildren {
    className?: string;
}

const Card = ({ children, className }: Props) => {
    return (
        <div
            className={cn(
                'relative flex flex-col gap-4 rounded-lg border border-border p-4',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default memo(Card);
