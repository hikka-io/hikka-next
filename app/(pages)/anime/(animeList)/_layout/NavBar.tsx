'use client';

import clsx from 'clsx';
import AntDesignFilterFilled from '~icons/ant-design/filter-filled';
import MaterialSymbolsSortRounded from '~icons/material-symbols/sort-rounded'

import Search from '@/app/(pages)/anime/(animeList)/_components/Search';
import useIsMobile from '@/utils/hooks/useIsMobile';
import useScrollTrigger from '@/utils/hooks/useScrollTrigger';
import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import useRouter from '@/utils/useRouter';

interface Props {}

const Component = ({}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()!;

    const isMobile = useIsMobile();
    const trigger = useScrollTrigger({
        threshold: 40,
        disableHysteresis: true,
    });

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
    }

    return (
        <div
            className={clsx(
                'flex items-end gap-2 md:gap-4 border-b border-b-transparent bg-transparent transition',
                isMobile && trigger && '!border-b-secondary !bg-base-100',
            )}
        >
            <Search />
            <label
                htmlFor="filterDrawer"
                className={clsx(
                    'btn btn-square btn-secondary btn-outline drawer-button flex lg:hidden',
                )}
            >
                <AntDesignFilterFilled />
            </label>
            <button
                onClick={switchSort}
                className={clsx(
                    'btn btn-square btn-secondary btn-outline',
                )}
            >
                <MaterialSymbolsSortRounded className={clsx(sort === 'asc' && "-scale-y-100")} />
            </button>
        </div>
    );
};

export default Component;
