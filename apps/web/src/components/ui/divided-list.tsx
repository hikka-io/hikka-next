import { Children, type ComponentProps, type FC } from 'react';

import { cn } from '@/utils/cn';

type Props = ComponentProps<'div'> & {
    columns?: 1 | 2;
};

const DividedList: FC<Props> = ({
    columns = 1,
    className,
    children,
    ...props
}) => {
    if (Children.toArray(children).length === 0) return null;

    return (
        <div
            className={cn(
                '-mx-4 grid grid-cols-1 md:mx-0 [&>*]:border-t [&>*]:px-4 md:[&>*]:px-0',
                columns === 2 && 'md:grid-cols-2 md:gap-x-12',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default DividedList;
