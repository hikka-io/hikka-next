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
    if (data && (Array.isArray(data) ? data.length > 0 : data.list.length > 0))
        return null;

    return (
        <div className="flex items-center justify-center py-6">
            {isFetching && !isRefetching ? (
                <span className="loading loading-spinner size-5! text-center"></span>
            ) : (
                <p className="text-muted-foreground text-center text-sm">
                    {data &&
                        (Array.isArray(data)
                            ? data.length === 0
                            : data.list.length === 0) &&
                        'За Вашим запитом нічого не знайдено'}

                    {!data &&
                        !isFetching &&
                        'Введіть назву, щоб розпочати пошук...'}
                </p>
            )}
        </div>
    );
};

export default memo(SearchPlaceholders);
