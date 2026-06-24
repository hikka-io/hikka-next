import { memo } from 'react';

import type { PaginationArgs } from '@hikka/client';

import Spinner from '@/components/ui/spinner';

type Props = {
    data?:
        | {
              list: unknown[];
              pagination: PaginationArgs;
          }
        | Array<unknown>;
    isFetching: boolean;
    isRefetching: boolean;
};

const SearchPlaceholders = ({ data, isFetching, isRefetching }: Props) => {
    if (data && (Array.isArray(data) ? data.length > 0 : data.list.length > 0))
        return null;

    return (
        <div className="flex items-center justify-center py-6">
            {isFetching && !isRefetching ? (
                <Spinner className="size-5! text-center" />
            ) : (
                <p className="text-center text-muted-foreground text-sm">
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
