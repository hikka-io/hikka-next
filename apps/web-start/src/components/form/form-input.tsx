import { useStore } from '@tanstack/react-form';
import { ComponentProps, FC } from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { useFieldContext } from './form-context';

export interface Props extends Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'onBlur'> {
    label?: string;
    description?: string;
    valueRenderer?: (value: string | string[]) => string;
    inputClassName?: string;
    onChangeValidator?: (value: string) => boolean;
}

export const TextField: FC<Props> = ({
    label,
    description,
    children,
    className,
    valueRenderer,
    inputClassName,
    onChangeValidator,
    ...props
}) => {
    const field = useFieldContext<string>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isInvalid = errors.length > 0;

    return (
        <Field data-invalid={isInvalid} className={className}>
            <div className="flex flex-nowrap items-center justify-between">
                {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
                {children}
            </div>
            <Input
                id={field.name}
                {...props}
                className={inputClassName}
                value={
                    valueRenderer
                        ? valueRenderer(field.state.value)
                        : (field.state.value ?? '')
                }
                onBlur={field.handleBlur}
                onChange={(e) => {
                    if (onChangeValidator) {
                        if (onChangeValidator(e.target.value)) {
                            field.handleChange(e.target.value);
                        }
                    } else {
                        field.handleChange(e.target.value);
                    }
                }}
                aria-invalid={isInvalid}
            />
            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}
            <FieldError errors={errors} />
        </Field>
    );
};

export default TextField;
