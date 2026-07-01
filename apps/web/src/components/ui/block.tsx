import { type ComponentPropsWithoutRef, memo } from 'react';

import { cn } from '@/utils/cn';

type Props = ComponentPropsWithoutRef<'section'>;

const Block = ({ children, className, ...props }: Props) => {
    return (
        <section
            className={cn('flex min-w-0 flex-col gap-5', className)}
            {...props}
        >
            {children}
        </section>
    );
};

export default memo(Block);
