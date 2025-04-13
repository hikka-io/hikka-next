import { ForwardedRef, forwardRef } from 'react';

import AntDesignArrowDownOutlined from './icons/ant-design/AntDesignArrowDownOutlined';
import { Button, ButtonProps } from './ui/button';

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
                variant="ghost"
                ref={ref}
                disabled={isFetchingNextPage}
                onClick={fetchNextPage}
            >
                {isFetchingNextPage ? (
                    <span className="loading loading-spinner"></span>
                ) : (
                    <AntDesignArrowDownOutlined />
                )}
                Показати ще
            </Button>
        );
    },
);

export default LoadMoreButton;
