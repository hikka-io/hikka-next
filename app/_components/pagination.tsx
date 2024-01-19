'use client';

import clsx from 'clsx';
import { Dispatch, SetStateAction } from 'react';
import AntDesignArrowLeftOutlined from '~icons/ant-design/arrow-left-outlined';
import AntDesignArrowRightOutlined from '~icons/ant-design/arrow-right-outlined';

import { Button } from '@/app/_components/ui/button';

interface Props {
    page: number;
    pages: number;
    setPage: Dispatch<SetStateAction<number>>;
}

const Component = ({ page, pages, setPage }: Props) => {
    const range = (min: number, max: number) => {
        const newArr = [];

        for (let i = min; i <= max; i++) {
            newArr.push(i);
        }

        return newArr;
    };

    const generatePaginationArr = () => {
        const pagArr: (number | undefined)[] = [1];

        if (pages >= 7) {
            if (pages - page <= 3) {
                pagArr.push(undefined);
                pagArr.push(...range(pages - 4, pages));

                return pagArr;
            }

            if (page < 5) {
                pagArr.push(...range(2, 5));
                pagArr.push(undefined);
                pagArr.push(pages);

                return pagArr;
            }

            pagArr.push(undefined);
            pagArr.push(...range(page - 1, page + 1));
            pagArr.push(undefined);
            pagArr.push(pages);

            return pagArr;
        }

        pagArr.push(...range(2, pages));
        return pagArr;
    };

    return (
        <div className="flex w-full justify-center gap-2 lg:gap-4">
            <Button
                size="icon-md"
                variant="outline"
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
                className={clsx('text-xs')}
            >
                <AntDesignArrowLeftOutlined />
            </Button>
            {generatePaginationArr().map((v, index) => {
                return (
                    <Button
                        size="icon-md"
                        variant={page === v ? 'default' : 'outline'}
                        disabled={!v}
                        onClick={() => v && setPage(v)}
                        key={index}
                    >
                        {v ? v : '...'}
                    </Button>
                );
            })}
            <Button
                size="icon-md"
                variant="outline"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === pages}
                className={clsx('text-xs')}
            >
                <AntDesignArrowRightOutlined />
            </Button>
        </div>
    );
};

export default Component;