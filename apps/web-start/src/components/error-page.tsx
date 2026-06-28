import { useEffect } from 'react';

import { isCancelledError } from '@tanstack/react-query';
import {
    ErrorComponent,
    type ErrorComponentProps,
} from '@tanstack/react-router';

const ErrorPage: React.FC<ErrorComponentProps> = (props) => {
    // A query still in-flight when its observer unmounts during navigation is
    // cancelled by TanStack Query, which rejects with a `CancelledError`. The
    // router only swallows `AbortError`, so this benign cancellation surfaces
    // here and blanks the page. Recover by resetting the boundary (re-render
    // from the already-prefetched cache) instead of re-running every loader —
    // `reset()` avoids the refetch flash that `router.invalidate()` would cause.
    const isCancelled =
        isCancelledError(props.error) ||
        (props.error as { name?: string } | undefined)?.name === 'AbortError';

    useEffect(() => {
        if (isCancelled) props.reset();
    }, [isCancelled, props.reset]);

    if (isCancelled) return null;

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <ErrorComponent {...props} />
        </div>
    );
};

export default ErrorPage;
