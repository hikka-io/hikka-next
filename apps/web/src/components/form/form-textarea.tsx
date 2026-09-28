import type { ComponentProps, FC } from 'react';

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

import { useFieldContext } from './form-context';
import { useVisibleErrors } from './use-visible-errors';

export type Props = Omit<
    ComponentProps<'textarea'>,
    'value' | 'onChange' | 'onBlur'
> & {
    label?: string;
    description?: string;
};

export const TextareaField: FC<Props> = ({
    label,
    description,
    children,
    className,
    ...props
}) => {
    const field = useFieldContext<string>();
    const errors = useVisibleErrors();
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
            {isInvalid ? (
                <FieldError errors={errors} />
            ) : (
                description && (
                    <FieldDescription>{description}</FieldDescription>
                )
            )}
        </Field>
    );
};

export default TextareaField;
