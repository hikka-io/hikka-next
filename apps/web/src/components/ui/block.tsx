import { ComponentPropsWithoutRef, memo } from 'react';

import { cn } from '@/utils/cn';

interface Props extends ComponentPropsWithoutRef<'section'> {}

const Block = ({ children, className, ...props }: Props) => {
    return (
        <section className={cn('flex flex-col gap-8', className)} {...props}>
            {children}
        </section>
    );
};

export default memo(Block);
