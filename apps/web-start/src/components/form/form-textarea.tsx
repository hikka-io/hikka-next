import { useStore } from '@tanstack/react-form';
import { ComponentProps, FC } from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

import { useFieldContext } from './form-context';

export interface Props extends Omit<ComponentProps<'textarea'>, 'value' | 'onChange' | 'onBlur'> {
    label?: string;
    description?: string;
}

export const TextareaField: FC<Props> = ({
    label,
    description,
    children,
    className,
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
            <Textarea
                id={field.name}
                rows={4}
                {...props}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
            />
            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}
            <FieldError errors={errors} />
        </Field>
    );
};

export default TextareaField;
