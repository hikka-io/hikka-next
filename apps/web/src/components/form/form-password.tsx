import type { ComponentProps, FC } from 'react';

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import PasswordInput from '@/components/ui/password-input';

import { useFieldContext } from './form-context';
import { useVisibleErrors } from './use-visible-errors';

export type Props = Omit<
    ComponentProps<typeof PasswordInput>,
    'value' | 'onChange' | 'onBlur'
> & {
    label?: string;
    description?: string;
};

export const PasswordField: FC<Props> = ({
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
            <PasswordInput
                id={field.name}
                {...props}
                value={field.state.value ?? ''}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
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

export default PasswordField;
