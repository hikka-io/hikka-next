'use client';

import { PaginationArgs } from '@hikka/client';
import { memo } from 'react';

interface Props {
    data?:
        | {
              list: unknown[];
              pagination: PaginationArgs;
          }
        | Array<unknown>;
    isFetching: boolean;
    isRefetching: boolean;
}

const SearchPlaceholders = ({ data, isFetching, isRefetching }: Props) => {
    return (
        <>
            {data &&
                (Array.isArray(data)
                    ? data.length === 0
                    : data.list.length === 0) && (
                    <p className="text-muted-foreground py-6 text-center text-sm">
                        За Вашим запитом нічого не знайдено
                    </p>
                )}
            {isFetching && !isRefetching && (
                <div className="w-full py-4 text-center">
                    <span className="loading loading-spinner"></span>
                </div>
            )}
            {!data && !isFetching && (
                <p className="text-muted-foreground py-6 text-center text-sm">
                    Введіть назву, щоб розпочати пошук...
                </p>
            )}
        </>
    );
};

export default memo(SearchPlaceholders);
