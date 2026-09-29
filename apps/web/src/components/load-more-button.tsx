import { type ForwardedRef, forwardRef } from 'react';

import AntDesignArrowDownOutlined from '@/components/icons/ant-design/AntDesignArrowDownOutlined';
import { Button, type ButtonProps } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';

type Props = ButtonProps & {
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
};

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
