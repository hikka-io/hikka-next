import { HikkaApiError } from '@hikka/api';

export const NETWORK_ERROR_MESSAGE = 'Немає з’єднання з інтернетом';

// What a failed fetch throws: iOS (React Native), Safari, Chrome, Firefox, and the native `fetch failed: …` of Expo's runtime.
const NETWORK_FAILURE_PATTERN =
    /^(network request failed|the network connection was lost\.?|the internet connection appears to be offline\.?|load failed|failed to fetch|networkerror when attempting to fetch resource\.?|fetch failed(: .*)?)$/i;

const ABORT_NAMES = new Set(['AbortError', 'CanceledError', 'CancelledError']);

const causeOf = (error: unknown): unknown =>
    error instanceof HikkaApiError ? error.data : error;

const isAbort = (error: unknown) =>
    [error, causeOf(error)].some(
        (candidate) =>
            candidate instanceof Error && ABORT_NAMES.has(candidate.name),
    );

// An aborted request or an exception raised before the request left the device is not a lost connection.
export function isNetworkError(error: unknown): boolean {
    if (!(error instanceof Error) || isAbort(error)) return false;

    const isFetchFailure =
        error instanceof HikkaApiError
            ? error.status === 0
            : error instanceof TypeError;

    return isFetchFailure && NETWORK_FAILURE_PATTERN.test(error.message.trim());
}

// The response validator throws a ZodError whose message is the JSON list of issues; the transport wraps it as an API error with the response's status.
function isValidationDump(error: Error): boolean {
    const cause = causeOf(error);
    if (
        error.name === 'ZodError' ||
        (cause instanceof Error && cause.name === 'ZodError')
    ) {
        return true;
    }

    try {
        const issues: unknown = JSON.parse(error.message);
        return (
            Array.isArray(issues) &&
            issues.length > 0 &&
            issues.every(
                (issue) =>
                    typeof issue === 'object' &&
                    issue !== null &&
                    'code' in issue &&
                    'path' in issue,
            )
        );
    } catch {
        return false;
    }
}

export function apiErrorMessage(error: unknown, fallback: string): string {
    if (isNetworkError(error)) return NETWORK_ERROR_MESSAGE;

    return error instanceof Error && error.message && !isValidationDump(error)
        ? error.message
        : fallback;
}
