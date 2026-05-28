import { useStore } from '@tanstack/react-form';
import { FC } from 'react';

import { BadgeFilter, BadgeFilterProps } from '@/components/ui/badge-filter';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

import { useFieldContext } from './form-context';


export interface BadgeFilterFieldProps
    extends Omit<BadgeFilterProps, 'onParamChange' | 'selected'> {
    label?: string;
    description?: string;
    className?: string;
}

export const BadgeFilterField: FC<BadgeFilterFieldProps> = ({
    label,
    description,
    className,
    properties,
    property,
    ...props
}) => {
    const field = useFieldContext<string[]>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isInvalid = errors.length > 0;

    return (
        <Field data-invalid={isInvalid} className={className}>
            <div className="flex flex-nowrap items-center justify-between">
                {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
            </div>
            <BadgeFilter
                properties={properties}
                selected={field.state.value ?? []}
                property={property}
                onParamChange={(_key, value) => {
                    field.handleChange(value as string[]);
                }}
                {...props}
            />
            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}
            <FieldError errors={errors} />
        </Field>
    );
};

export default BadgeFilterField;
