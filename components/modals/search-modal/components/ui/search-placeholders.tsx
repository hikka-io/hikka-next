'use client';

import * as React from 'react';
import { memo } from 'react';

interface Props {
    data?: API.WithPagination<unknown>;
    isFetching: boolean;
    isRefetching: boolean;
}

const SearchPlaceholders = ({ data, isFetching, isRefetching }: Props) => {
    return (
        <>
            {data && data.list.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                    За Вашим запитом нічого не знайдено
                </p>
            )}
            {isFetching && !isRefetching && (
                <div className="w-full py-4 text-center">
                    <span className="loading loading-spinner"></span>
                </div>
            )}
            {!data && !isFetching && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                    Введіть назву, щоб розпочати пошук...
                </p>
            )}
        </>
    );
};

export default memo(SearchPlaceholders);
