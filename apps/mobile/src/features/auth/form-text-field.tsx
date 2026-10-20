import type { ComponentProps, FC } from 'react';

import TextField from './text-field';

type FieldApi = {
    state: {
        value: string;
        meta: {
            isBlurred: boolean;
            errors: ({ message?: string } | undefined)[];
        };
    };
    handleChange: (value: string) => void;
    handleBlur: () => void;
};

type Props = Omit<
    ComponentProps<typeof TextField>,
    'value' | 'onChangeText' | 'onBlur' | 'error'
> & {
    field: FieldApi;
    submitted: boolean;
};

// Errors appear once the field was left or a submit was attempted, so typing never flashes a message.
const FormTextField: FC<Props> = ({ field, submitted, ...props }) => (
    <TextField
        value={field.state.value}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
        error={
            field.state.meta.isBlurred || submitted
                ? field.state.meta.errors[0]?.message
                : undefined
        }
        {...props}
    />
);

export default FormTextField;
