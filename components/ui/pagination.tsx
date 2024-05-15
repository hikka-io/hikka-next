'use client';

import { ChangeEvent, FC, useEffect, useState } from 'react';
import AntDesignArrowLeftOutlined from '~icons/ant-design/arrow-left-outlined';
import AntDesignArrowRightOutlined from '~icons/ant-design/arrow-right-outlined';

import { range } from '@antfu/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';

interface Props {
    page: number;
    pages: number;
    setPage: (page: number) => void;
}

type PaginationType = number | 'empty' | 'input';

const PaginationEmpty: FC = () => {
    return (
        <Button
            size="icon-md"
            variant="outline"
            disabled
            className={cn('size-9 sm:size-10')}
        >
            ...
        </Button>
    );
};

interface PaginationButtonProps {
    value: number;
    page: number;
    setPage: (page: number) => void;
}

const PaginationButton: FC<PaginationButtonProps> = ({
    value,
    page,
    setPage,
}) => {
    return (
        <Button
            size="icon-md"
            variant={value === page ? 'default' : 'outline'}
            disabled={!value}
            onClick={() => value && setPage(value)}
            className={cn('size-9 sm:size-10')}
        >
            {value}
        </Button>
    );
};

interface PaginationInputProps {
    pages: number;
    page: number;
    setPage: (page: number) => void;
}

const PaginationInput: FC<PaginationInputProps> = ({
    page,
    setPage,
    pages,
}) => {
    const [pageToMove, setPageToMove] = useState<string>('');

    const handleMoveToPage = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const digitsOnlyRegex = /^(?!0)\d+$/;

        if (!digitsOnlyRegex.test(value)) return setPageToMove('');

        if (parseInt(value) > pages) return;

        setPageToMove(value);
    };

    useEffect(() => {
        setPageToMove('');
    }, [page]);

    return (
        <Input
            value={pageToMove}
            placeholder="..."
            onChange={handleMoveToPage}
            onKeyDown={(e) => {
                if (!pageToMove) return;

                if (e.key === 'Enter') {
                    e.preventDefault();
                    setPage(parseInt(pageToMove));
                    setPageToMove('');
                }
            }}
            className={cn('size-9 sm:size-10', pageToMove && ' w-16 sm:w-16')}
        />
    );
};

const Pagination = ({ page, pages, setPage }: Props) => {
    const generatePaginationArr = () => {
        const pagArr: PaginationType[] = [1];

        if (pages >= 7) {
            if (pages - page <= 3) {
                pagArr.push('input');
                pagArr.push(...range(pages - 4, pages + 1));

                return pagArr;
            }

            if (page < 5) {
                pagArr.push(...range(2, 6));
                pagArr.push('input');
                pagArr.push(pages);

                return pagArr;
            }

            pagArr.push('empty');
            pagArr.push(...range(page - 1, page + 2));
            pagArr.push('input');
            pagArr.push(pages);

            return pagArr;
        }

        pagArr.push(...range(2, pages + 1));

        return pagArr;
    };

    return (
        <div className="flex w-full justify-center gap-2 lg:gap-4">
            <Button
                size="icon-md"
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={cn('size-9 text-xs sm:size-10')}
            >
                <AntDesignArrowLeftOutlined />
            </Button>
            {generatePaginationArr().map((value, index) => {
                if (typeof value === 'number') {
                    return (
                        <PaginationButton
                            key={index}
                            value={value}
                            page={page}
                            setPage={setPage}
                        />
                    );
                }

                if (value === 'empty') {
                    return <PaginationEmpty key={index} />;
                }

                return (
                    <PaginationInput
                        page={page}
                        setPage={setPage}
                        pages={pages}
                        key={index}
                    />
                );
            })}
            <Button
                size="icon-md"
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === pages}
                className={cn('size-9 text-xs sm:size-10')}
            >
                <AntDesignArrowRightOutlined />
            </Button>
        </div>
    );
};

export default Pagination;
