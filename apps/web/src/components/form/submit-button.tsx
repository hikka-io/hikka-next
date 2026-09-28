import type { FC } from 'react';

import { useHydrated } from '@tanstack/react-router';

import { Button, type ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';

type Props = Omit<ButtonProps, 'type'> & {
    loading?: boolean;
};

export const SubmitButton: FC<Props> = ({
    loading,
    disabled,
    children,
    ...props
}) => {
    // Before hydration the form is plain HTML: a click would submit it natively (GET, reload, cleared fields).
    const hydrated = useHydrated();

    return (
        <Button
            type="submit"
            disabled={!hydrated || loading || disabled}
            {...props}
        >
            {loading && <Spinner />}
            {children}
        </Button>
    );
};

export default SubmitButton;
