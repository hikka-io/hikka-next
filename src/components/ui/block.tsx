import { PropsWithChildren, memo } from 'react';

import { cn } from '@/utils/utils';

interface Props extends PropsWithChildren {
    className?: string;
}

const Block = ({ children, className }: Props) => {
    return (
        <div className={cn('flex flex-col gap-8', className)}>{children}</div>
    );
};

export default memo(Block);
