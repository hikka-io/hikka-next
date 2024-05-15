'use client';

import clsx from 'clsx';
import { ChangeEvent, useEffect, useState } from 'react';
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

const Component = ({ page, pages, setPage }: Props) => {
    const [pageToMove, setPageToMove] = useState<string>('');

    const generatePaginationArr = () => {
        const pagArr: (number | undefined)[] = [1];

        if (pages >= 7) {
            if (pages - page <= 3) {
                pagArr.push(undefined);
                pagArr.push(...range(pages - 4, pages + 1));

                return pagArr;
            }

            if (page < 5) {
                pagArr.push(...range(2, 6));
                pagArr.push(undefined);
                pagArr.push(pages);

                return pagArr;
            }

            pagArr.push(undefined);
            pagArr.push(...range(page - 1, page + 2));
            pagArr.push(undefined);
            pagArr.push(pages);

            return pagArr;
        }

        pagArr.push(...range(2, pages + 1));

        return pagArr;
    };

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
        <div className="flex w-full justify-center gap-2 lg:gap-4">
            <Button
                size="icon-md"
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={clsx('text-xs h-9 w-9 sm:h-10 sm:w-10')}
            >
                <AntDesignArrowLeftOutlined />
            </Button>
            {generatePaginationArr().map((v, index) => {
                if (v) {
                    return (
                        <Button
                            size="icon-md"
                            variant={page === v ? 'default' : 'outline'}
                            disabled={!v}
                            onClick={() => v && setPage(v)}
                            key={index}
                            className={cn('size-9 sm:size-10')}
                        >
                            {v}
                        </Button>
                    );
                }

                return (
                    <Input
                        key={index}
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
                        className={cn(
                            'size-9 sm:size-10',
                            pageToMove && 'focus-visible:none  w-16 sm:w-16',
                        )}
                    />
                );
            })}
            <Button
                size="icon-md"
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={page === pages}
                className={clsx('text-xs h-9 w-9 sm:h-10 sm:w-10')}
            >
                <AntDesignArrowRightOutlined />
            </Button>
        </div>
    );
};

export default Component;
