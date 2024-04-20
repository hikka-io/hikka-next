import { ForwardedRef, forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

interface Props extends ButtonProps {
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
}

const LoadMoreButton = forwardRef(
    (
        { fetchNextPage, isFetchingNextPage }: Props,
        ref: ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <Button
                variant="outline"
                ref={ref}
                disabled={isFetchingNextPage}
                onClick={fetchNextPage}
                className="w-full"
            >
                {isFetchingNextPage && (
                    <span className="loading loading-spinner"></span>
                )}
                Завантажити ще
            </Button>
        );
    },
);

export default LoadMoreButton;
