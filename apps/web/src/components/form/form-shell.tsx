import type { ComponentProps, FC } from 'react';

import { useFormContext } from './form-context';

type Props = Omit<ComponentProps<'form'>, 'onSubmit'>;

export const Form: FC<Props> = (props) => {
    const form = useFormContext();

    return (
        <form
            {...props}
            onSubmit={(e) => {
                e.preventDefault();
                // Plate's link and video dialogs portal a form inside outer forms; React bubbles submit through portals.
                e.stopPropagation();
                form.handleSubmit();
            }}
        />
    );
};

export default Form;
