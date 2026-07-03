import * as React from 'react';

import { cn } from '@/utils/cn';

import { FIELD_BASE } from './field-base';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    FIELD_BASE,
                    'flex h-10 px-3 py-2 file:border-0 file:bg-transparent file:font-medium file:text-sm',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

export { Input };
