// A ZodError message is a JSON dump of the issues (a response that no longer matches the spec), not something to show a person.
export function apiErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message && error.name !== 'ZodError'
        ? error.message
        : fallback;
}
