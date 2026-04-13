import { useStore } from '@tanstack/react-form';
import { ComponentProps, FC } from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

import { useFieldContext } from './form-context';


export interface SwitchFieldProps extends Omit<ComponentProps<typeof Switch>, 'checked' | 'onCheckedChange'> {
    label?: string;
    description?: string;
}

export const SwitchField: FC<SwitchFieldProps> = ({
    label,
    description,
    className,
    ...props
}) => {
    const field = useFieldContext<boolean>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isInvalid = errors.length > 0;

    return (
        <Field data-invalid={isInvalid} className={className}>
            <div className="flex w-full flex-row items-center justify-between gap-2">
                <div>
                    {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
                    {description && (
                        <FieldDescription>{description}</FieldDescription>
                    )}
                </div>
                <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked as boolean)}
                    {...props}
                />
            </div>
            <FieldError errors={errors} />
        </Field>
    );
};

export default SwitchField;
