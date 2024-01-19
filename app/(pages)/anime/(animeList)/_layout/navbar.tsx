'use client';

import clsx from 'clsx';
import { useCallback } from 'react';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { usePathname, useSearchParams } from 'next/navigation';

import Search from '@/app/(pages)/anime/(animeList)/_components/search';
import FiltersModal from '@/app/(pages)/anime/(animeList)/_layout/filters-modal';
import { Button } from '@/app/_components/ui/button';
import useRouter from '@/utils/useRouter';

interface Props {}

const Component = ({}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const sort = searchParams.get('sort');

    const createQueryString = useCallback(
        (name: string, value: string | string[] | boolean) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');

            if (value) {
                if (Array.isArray(value)) {
                    params.delete(name);
                    value.forEach((v) => params.append(name, String(v)));
                } else {
                    params.set(name, String(value));
                }
            } else {
                params.delete(name);
            }

            return params.toString();
        },
        [searchParams],
    );

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(name, value);
        router.replace(`${pathname}?${query}`);
    };

    const switchSort = () => {
        if (sort === 'asc') {
            handleChangeParam('sort', 'desc');
        } else {
            handleChangeParam('sort', 'asc');
        }
    };

    return (
        <div
            className={clsx(
                'flex items-end gap-2 md:gap-4 border-b border-b-transparent bg-transparent transition',
            )}
        >
            <Search />
            <Button variant="outline" size="icon" onClick={switchSort}>
                <MaterialSymbolsSortRounded
                    className={clsx(sort === 'asc' && '-scale-y-100')}
                />
            </Button>
            <div className="lg:hidden">
                <FiltersModal />
            </div>
        </div>
    );
};

export default Component;