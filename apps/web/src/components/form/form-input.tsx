import { ComponentProps, FC } from 'react';

import { cn } from '@/utils/utils';

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

interface Props extends ComponentProps<'input'> {
    name: string;
    label?: string;
    description?: string;
    valueRenderer?: (value: string | string[]) => void;
    inputClassName?: string;
    onChangeValidator?: (value: string) => boolean;
}

const FormInput: FC<Props> = ({
    name,
    label,
    description,
    children,
    className,
    valueRenderer,
    inputClassName,
    onChangeValidator,
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
                        <Input
                            {...props}
                            {...field}
                            className={cn(inputClassName)}
                            value={
                                valueRenderer
                                    ? valueRenderer(field.value)
                                    : field.value
                            }
                            onChange={(e) => {
                                if (onChangeValidator) {
                                    if (onChangeValidator(e.target.value)) {
                                        field.onChange(e);
                                    }
                                } else {
                                    field.onChange(e);
                                }
                            }}
                        />
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
