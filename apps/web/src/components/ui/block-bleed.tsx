import { type ComponentProps, memo } from 'react';

import { cn } from '@/utils/cn';

type Props = ComponentProps<'div'>;

const BlockBleed = ({ children, className, ...props }: Props) => {
    return (
        <div className={cn('-mx-4 flex flex-col', className)} {...props}>
            {children}
        </div>
    );
};

export default memo(BlockBleed);
