import { PropsWithChildren, memo } from 'react';

import { cn } from '@/utils/utils';

interface Props extends PropsWithChildren {
    className?: string;
}

const Card = ({ children, className }: Props) => {
    return (
        <div
            className={cn(
                'flex flex-col gap-4 rounded-lg border border-secondary/60 bg-secondary/30 p-4',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default memo(Card);
