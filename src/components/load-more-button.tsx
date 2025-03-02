import { ForwardedRef, forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

import MaterialSymbolsMoreHoriz from './icons/material-symbols/MaterialSymbolsMoreHoriz';

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
            >
                {isFetchingNextPage ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    <MaterialSymbolsMoreHoriz className="size-4" />
                )}
                Завантажити ще
            </Button>
        );
    },
);

export default LoadMoreButton;
