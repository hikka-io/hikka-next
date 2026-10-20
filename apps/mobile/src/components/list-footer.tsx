import type { FC } from 'react';

import ErrorState from './ui/error-state';
import { Spinner } from './ui/spinner';

type Props = {
    fetching: boolean;
    error: boolean;
    onRetry: () => void;
};

/** The footer of an infinite list: a spinner while the next page loads, a retry when it failed. */
const ListFooter: FC<Props> = ({ fetching, error, onRetry }) => {
    if (fetching) return <Spinner className="py-4" />;

    if (error) {
        return (
            <ErrorState
                variant="inline"
                onRetry={onRetry}
                className="items-center py-4"
            />
        );
    }

    return null;
};

export default ListFooter;
