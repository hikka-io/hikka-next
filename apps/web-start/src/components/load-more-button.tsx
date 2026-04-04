import { ForwardedRef, forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';

import AntDesignArrowDownOutlined from './icons/ant-design/AntDesignArrowDownOutlined';

interface Props extends ButtonProps {
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
}

const LoadMoreButton = forwardRef(
    (
        { fetchNextPage, isFetchingNextPage, ...props }: Props,
        ref: ForwardedRef<HTMLButtonElement>,
    ) => {
        return (
            <Button
                variant="ghost"
                size="md"
                ref={ref}
                disabled={isFetchingNextPage}
                onClick={fetchNextPage}
                {...props}
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
