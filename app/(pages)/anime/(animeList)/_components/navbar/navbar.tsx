'use client';

import clsx from 'clsx';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Search from './_components/search';
import FiltersModal from '@/app/_components/modals/filters-modal';
import { Button } from '@/app/_components/ui/button';
import createQueryString from '@/app/_utils/createQueryString';

interface Props {}

const Component = ({}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const sort = searchParams.get('sort');

    const handleChangeParam = (
        name: string,
        value: string | string[] | boolean,
    ) => {
        const query = createQueryString(
            name,
            value,
            new URLSearchParams(searchParams),
        );
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