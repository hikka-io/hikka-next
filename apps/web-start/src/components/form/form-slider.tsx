import { useStore } from '@tanstack/react-form';
import { ComponentProps, FC } from 'react';

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Slider } from '@/components/ui/slider';

import { useFieldContext } from './form-context';


export interface SliderFieldProps extends Omit<ComponentProps<typeof Slider>, 'value' | 'onValueChange'> {
    label?: string;
    description?: string;
}

export const SliderField: FC<SliderFieldProps> = ({
    label,
    description,
    className,
    ...props
}) => {
    const field = useFieldContext<number[]>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isInvalid = errors.length > 0;

    return (
        <Field data-invalid={isInvalid} className={className}>
            <div className="flex flex-nowrap items-center justify-between">
                {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
            </div>
            <Slider
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value)}
                {...props}
            />
            {description && (
                <FieldDescription>{description}</FieldDescription>
            )}
            <FieldError errors={errors} />
        </Field>
    );
};

export default SliderField;
