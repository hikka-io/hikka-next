'use client';

import clsx from 'clsx';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import AntDesignArrowLeftOutlined from '~icons/ant-design/arrow-left-outlined';
import AntDesignArrowRightOutlined from '~icons/ant-design/arrow-right-outlined';
import AntDesignClearOutlined from '~icons/ant-design/clear-outlined';

import { usePathname, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import AnimeCard from '@/app/_components/AnimeCard';
import NotFound from '@/app/_components/NotFound';
import SkeletonCard from '@/app/_components/skeletons/EntryCard';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import useDebounce from '@/utils/hooks/useDebounce';
import { useAuthContext } from '@/utils/providers/AuthProvider';
import useRouter from '@/utils/useRouter';

interface Props {
    page: number,
    pages: number,
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
            <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
                className={clsx(
                    'btn-badge btn btn-square btn-secondary btn-outline text-xs lg:btn-md lg:text-base',
                )}
            >
                <AntDesignArrowLeftOutlined />
            </button>
            {generatePaginationArr().map(
                (v, index) => {
                    return (
                        <button
                            disabled={!v}
                            onClick={() => v && setPage(v)}
                            key={index}
                            className={clsx(
                                'btn-badge btn btn-square text-xs lg:btn-md lg:text-base',
                                page === v
                                    ? 'btn-accent'
                                    : 'btn-secondary btn-outline',
                                !v && '!btn-ghost',
                            )}
                        >
                            {v ? v : '...'}
                        </button>
                    );
                },
            )}
            <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page === pages}
                className={clsx(
                    'btn-badge btn btn-square btn-secondary btn-outline text-xs lg:btn-md lg:text-base',
                )}
            >
                <AntDesignArrowRightOutlined />
            </button>
        </div>
    );
};

export default Component;
