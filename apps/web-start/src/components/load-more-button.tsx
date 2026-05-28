import { ForwardedRef, forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';

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
                    <Spinner />
                ) : (
                    <AntDesignArrowDownOutlined />
                )}
                Показати ще
            </Button>
        );
    },
);

export default LoadMoreButton;
