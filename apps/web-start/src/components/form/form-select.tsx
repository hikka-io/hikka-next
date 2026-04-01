import { FC, ReactNode, memo, useMemo } from 'react';

import {
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectProps,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface FormSelectProps
    extends Omit<SelectProps, 'value' | 'onValueChange'> {
    name: string;
    label?: string;
    description?: string;
    placeholder?: string;
    className?: string;
    children?: ReactNode;
}

const FormSelect: FC<FormSelectProps> = ({
    name,
    label,
    description,
    placeholder,
    className,
    children,
    multiple,
    ...props
}) => {
    return (
        <FormField
            name={name}
            render={({ field }) => {
                const { value: fieldValue, onChange } = field;

                const selectValue = useMemo(() => {
                    if (fieldValue === undefined || fieldValue === null) {
                        return [];
                    }
                    return Array.isArray(fieldValue)
                        ? fieldValue
                        : [fieldValue];
                }, [fieldValue]);

                const handleValueChange = (newValue: string[]) => {
                    onChange(multiple ? newValue : (newValue[0] ?? null));
                };

                return (
                    <FormItem className={className}>
                        {label && (
                            <div className="flex flex-nowrap items-center justify-between">
                                <FormLabel>{label}</FormLabel>
                            </div>
                        )}

                        <Select
                            value={selectValue}
                            onValueChange={handleValueChange}
                            multiple={multiple}
                            {...props}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            {children}
                        </Select>

                        {description && (
                            <FormDescription>{description}</FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
};

export default memo(FormSelect);
