import {
    Children,
    type ComponentProps,
    createContext,
    isValidElement,
    memo,
    type ReactNode,
    use,
} from 'react';

import { Header } from '@/components/ui/header';
import { SURFACE_CLASS_NAME, SURFACE_VARIANTS } from '@/components/ui/surface';
import { cn } from '@/utils/cn';

type Variant = 'open' | 'card';

type Props = ComponentProps<'section'> & {
    variant?: Variant;
    flushOnMobile?: boolean;
    headerInside?: boolean;
};

const CARD_CLASS_NAME = cn(
    'gap-4 overflow-clip p-4',
    SURFACE_CLASS_NAME,
    SURFACE_VARIANTS.surface,
);

const FLUSH_ON_MOBILE_CLASS_NAME =
    '-mx-4 rounded-none border-x-0 sm:mx-0 sm:rounded-lg sm:border-x';

const VARIANTS: Record<Variant, string> = {
    open: 'gap-5',
    card: CARD_CLASS_NAME,
};

const BlockFlushOnMobileContext = createContext(false);

const splitHeader = (children: ReactNode) => {
    const items = Children.toArray(children);
    const index = items.findIndex(
        (child) => isValidElement(child) && child.type === Header,
    );

    return {
        header: index === -1 ? null : items[index],
        body: items.filter((_, i) => i !== index),
    };
};

const Block = ({
    children,
    className,
    variant = 'open',
    flushOnMobile,
    headerInside,
    ...props
}: Props) => {
    const flushContext = use(BlockFlushOnMobileContext);
    const flush = variant === 'card' && (flushOnMobile ?? flushContext);

    if (variant === 'card' && !headerInside) {
        const { header, body } = splitHeader(children);

        if (header) {
            return (
                <section
                    className={cn('flex min-w-0 flex-col gap-5', className)}
                    {...props}
                >
                    {header}
                    <div
                        className={cn(
                            'flex min-w-0 flex-1 flex-col',
                            CARD_CLASS_NAME,
                            flush && FLUSH_ON_MOBILE_CLASS_NAME,
                        )}
                    >
                        {body}
                    </div>
                </section>
            );
        }
    }

    return (
        <section
            className={cn(
                'flex min-w-0 flex-col',
                VARIANTS[variant],
                flush && FLUSH_ON_MOBILE_CLASS_NAME,
                className,
            )}
            {...props}
        >
            {children}
        </section>
    );
};

export { BlockFlushOnMobileContext };

export default memo(Block);
