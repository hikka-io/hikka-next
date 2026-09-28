import { useStore } from '@tanstack/react-form';

import { useFieldContext } from './form-context';

/**
 * Whether a field should show its validation errors yet.
 *
 * Forms that validate on change know a field is invalid from the first
 * keystroke; saying so while the user is still typing ("at least 5
 * characters" after one letter) is noise. So a field stays quiet until the
 * user leaves it or tries to submit, and from then on follows every
 * keystroke — the message goes away the moment the value becomes valid.
 *
 * Forms that validate on submit only are unaffected: they have no errors
 * before the first submit anyway.
 */
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
