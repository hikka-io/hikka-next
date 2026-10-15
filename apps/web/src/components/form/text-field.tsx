import type { ComponentProps, FC, ReactNode } from 'react';

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

import { useFieldContext } from './form-context';
import { useVisibleErrors } from './use-visible-errors';

export type Props = Omit<
    ComponentProps<'input'>,
    'value' | 'onChange' | 'onBlur'
> & {
    label?: string;
    description?: string;
    startIcon?: ReactNode;
    valueRenderer?: (value: string | string[]) => string;
    inputClassName?: string;
    onChangeValidator?: (value: string) => boolean;
};

export const TextField: FC<Props> = ({
    label,
    description,
    startIcon,
    children,
    className,
    valueRenderer,
    inputClassName,
    onChangeValidator,
    ...props
}) => {
    const field = useFieldContext<string>();
    const errors = useVisibleErrors();
    const isInvalid = errors.length > 0;

    const input = (
        <Input
            id={field.name}
            {...props}
            className={cn(startIcon && 'pl-9', inputClassName)}
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
    );

    return (
        <Field data-invalid={isInvalid} className={className}>
            <div className="flex flex-nowrap items-center justify-between">
                {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
                {children}
            </div>
            {startIcon ? (
                <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
                        {startIcon}
                    </span>
                    {input}
                </div>
            ) : (
                input
            )}
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

export default TextField;
