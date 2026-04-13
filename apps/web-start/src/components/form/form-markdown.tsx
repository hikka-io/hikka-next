import { useStore } from '@tanstack/react-form';
import { FC } from 'react';

import {
    PlateMarkdownEditor,
    PlateMarkdownEditorProps,
} from '@/components/plate/editor/plate-editor';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';

import { useFieldContext } from './form-context';

export interface Props extends Omit<PlateMarkdownEditorProps, 'value' | 'onValueChange'> {
    label?: string;
    description?: string;
    className?: string;
}

export const MarkdownField: FC<Props> = ({
    label,
    description,
    className,
    ...props
}) => {
    const field = useFieldContext<string>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isInvalid = errors.length > 0;

    return (
        <Field data-invalid={isInvalid}>
            {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
            <PlateMarkdownEditor
                {...props}
                value={field.state.value || ''}
                onValueChange={(value) => field.handleChange(value)}
                className={className}
            />
            <div className="space-y-2 px-3">
                {description && (
                    <FieldDescription>{description}</FieldDescription>
                )}
                <FieldError errors={errors} />
            </div>
        </Field>
    );
};

export default MarkdownField;
