import React, { ComponentProps, FC } from 'react';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

interface Props extends ComponentProps<'textarea'> {
    name: string;
    label?: string;
    description?: string;
}

const FormTextarea: FC<Props> = ({
    name,
    label,
    description,
    children,
    ...props
}) => {
    return (
        <FormField
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div className="flex flex-nowrap items-center justify-between">
                        {label && <FormLabel>{label}</FormLabel>}
                        {children}
                    </div>
                    <FormControl>
                        <Textarea rows={3} {...props} {...field} />
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

export default FormTextarea;
