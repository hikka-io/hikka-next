import { useStore } from '@tanstack/react-form';
import { FC, ReactNode, memo, useMemo } from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
    Select,
    SelectProps,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useFieldContext } from './form-context';


export interface SelectFieldProps
    extends Omit<SelectProps, 'value' | 'onValueChange'> {
    label?: string;
    description?: string;
    placeholder?: string;
    className?: string;
    children?: ReactNode;
}

const SelectFieldInner: FC<SelectFieldProps> = ({
    label,
    description,
    placeholder,
    className,
    children,
    multiple,
    ...props
}) => {
    const field = useFieldContext<string | string[] | null>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isInvalid = errors.length > 0;

    const selectValue = useMemo(() => {
        const fieldValue = field.state.value;
        if (fieldValue === undefined || fieldValue === null) {
            return [];
        }
        return Array.isArray(fieldValue)
            ? fieldValue
            : [fieldValue];
    }, [field.state.value]);

    const handleValueChange = (newValue: string[]) => {
        field.handleChange(multiple ? newValue : (newValue[0] ?? null));
    };

    return (
        <Field data-invalid={isInvalid} className={className}>
            {label && (
                <div className="flex flex-nowrap items-center justify-between">
                    <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                </div>
            )}

            <Select
                value={selectValue}
                onValueChange={handleValueChange}
                multiple={multiple}
                {...props}
            >
                <SelectTrigger aria-invalid={isInvalid}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                {children}
            </Select>

            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}
            <FieldError errors={errors} />
        </Field>
    );
};

export const SelectField = memo(SelectFieldInner);

export default SelectField;
