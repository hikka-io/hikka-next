import { PropsWithChildren } from 'react';

import { cn } from '@/utils/utils';

interface Props extends PropsWithChildren {
    className?: string;
    extended?: boolean;
    size: 3 | 4 | 5 | 6;
    extendedSize?: 3 | 4 | 5 | 6;
}

const SIZES = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-4 md:grid-cols-6',
};

const EXTENDED_SIZES = {
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-6',
};

const Stack = ({
    children,
    extended,
    size,
    extendedSize,
    className,
}: Props) => {
    return (
        <div
            className={cn(
                'grid gap-4 lg:gap-8',
                SIZES[size],
                extended &&
                    (extendedSize
                        ? EXTENDED_SIZES[extendedSize]
                        : 'grid-cols-2 md:grid-cols-6'),
                !extended &&
                    'no-scrollbar -mx-4 auto-cols-scroll grid-flow-col grid-cols-scroll overflow-x-auto px-4',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default Stack;
