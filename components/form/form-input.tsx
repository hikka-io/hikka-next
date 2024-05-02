import React, { ComponentProps, FC } from 'react';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface Props extends ComponentProps<'input'> {
    name: string;
    label?: string;
    description?: string;
}

const FormInput: FC<Props> = ({
    name,
    label,
    description,
    children,
    className,
    ...props
}) => {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <div className="flex flex-nowrap items-center justify-between">
                        {label && <FormLabel>{label}</FormLabel>}
                        {children}
                    </div>
                    <FormControl>
                        <Input {...props} {...field} />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormInput;
