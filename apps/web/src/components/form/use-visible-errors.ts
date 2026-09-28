import { useStore } from '@tanstack/react-form';

import { useFieldContext } from './form-context';

export const shouldShowErrors = ({
    isBlurred,
    submissionAttempts,
}: {
    isBlurred: boolean;
    submissionAttempts: number;
}) => isBlurred || submissionAttempts > 0;

export const useVisibleErrors = () => {
    const field = useFieldContext<unknown>();
    const errors = useStore(field.store, (state) => state.meta.errors);
    const isBlurred = useStore(field.store, (state) => state.meta.isBlurred);
    const submissionAttempts = useStore(
        field.form.store,
        (state) => state.submissionAttempts,
    );

    return shouldShowErrors({ isBlurred, submissionAttempts }) ? errors : [];
};
