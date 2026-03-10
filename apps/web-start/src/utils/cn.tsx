import { type ClassValue, clsx } from 'clsx';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

/** Tailwind CSS classnames merge. */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function withProps<T extends React.ElementType>(
    Component: T,
    defaultProps: Partial<React.ComponentPropsWithoutRef<T>>,
) {
    const ComponentWithClassName = Component as React.FC<{
        className?: string;
    }>;

    return React.forwardRef<
        React.ComponentRef<T>,
        React.ComponentPropsWithoutRef<T>
    >(function ExtendComponent(props, ref) {
        const newProps: any = { ...defaultProps, ...props };
        const className = cn(
            (defaultProps as any).className,
            (props as any).className,
        );

        if (className) {
            newProps.className = className;
        }

        return <ComponentWithClassName ref={ref} {...newProps} />;
    });
}

