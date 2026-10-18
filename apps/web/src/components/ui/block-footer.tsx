import { type ComponentProps, memo } from 'react';

import { cn } from '@/utils/cn';

type Props = ComponentProps<'div'>;

const BlockFooter = ({ children, className, ...props }: Props) => {
    return (
        <div
            className={cn(
                '-mx-4 -mb-4 flex items-center gap-4 rounded-b-lg border-t px-4 py-3',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default memo(BlockFooter);
