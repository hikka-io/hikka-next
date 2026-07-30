import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './form-context';
import { TextField } from './form-input';

export const { useAppForm: useTextForm } = createFormHook({
    fieldComponents: { TextField },
    formComponents: {},
    fieldContext,
    formContext,
});
