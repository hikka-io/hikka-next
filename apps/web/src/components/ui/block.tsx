import { type ComponentProps, memo } from 'react';

import { SURFACE_CLASS_NAME, SURFACE_VARIANTS } from '@/components/ui/surface';
import { cn } from '@/utils/cn';

type Variant = 'open' | 'card';

type Props = ComponentProps<'section'> & {
    variant?: Variant;
    flushOnMobile?: boolean;
};

const VARIANTS: Record<Variant, string> = {
    open: 'gap-5',
    card: cn(
        'gap-4 overflow-clip p-4',
        SURFACE_CLASS_NAME,
        SURFACE_VARIANTS.surface,
    ),
};

const Block = ({
    children,
    className,
    variant = 'open',
    flushOnMobile,
    ...props
}: Props) => {
    return (
        <section
            className={cn(
                'flex min-w-0 flex-col',
                VARIANTS[variant],
                flushOnMobile &&
                    '-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x',
                className,
            )}
            {...props}
        >
            {children}
        </section>
    );
};

export default memo(Block);
