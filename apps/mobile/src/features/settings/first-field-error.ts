type FormState = {
    submissionAttempts: number;
    fieldMeta: Record<
        string,
        { isBlurred: boolean; errors: unknown[] } | undefined
    >;
};

const messageOf = (error: unknown) =>
    (error as { message?: string } | undefined)?.message;

/**
 * The message the section footer shows: the first invalid field among `names`, once the user left
 * it or tried to submit, so typing never flashes an error.
 */
export function firstFieldError(
    state: FormState,
    names: readonly string[],
): string | undefined {
    for (const name of names) {
        const meta = state.fieldMeta[name];
        const message = messageOf(meta?.errors[0]);

        if (message && (meta?.isBlurred || state.submissionAttempts > 0)) {
            return message;
        }
    }

    return undefined;
}
