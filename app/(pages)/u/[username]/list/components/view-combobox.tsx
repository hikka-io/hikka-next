'use client';

import { Fragment } from 'react';
import IcRoundGridView from '~icons/ic/round-grid-view';
import MaterialSymbolsEventList from '~icons/material-symbols/event-list';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { PopoverTrigger } from '@/components/ui/popover';
import createQueryString from '@/utils/createQueryString';

const Component = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const view = searchParams.get('view') as 'table' | 'grid' | undefined;

    const handleChangeView = (value: 'table' | 'grid') => {
        const query = createQueryString(
            'view',
            value,
            new URLSearchParams(searchParams),
        );
        router.replace(`${pathname}?${query}`);
    };

    return (
        <Combobox
            side="bottom"
            align="end"
            options={[
                {
                    label: (
                        <Fragment>
                            <MaterialSymbolsEventList /> Таблиця
                        </Fragment>
                    ),
                    value: 'table',
                },
                {
                    label: (
                        <Fragment>
                            <IcRoundGridView /> Сітка
                        </Fragment>
                    ),
                    value: 'grid',
                },
            ]}
            onChange={(value) => handleChangeView(value as 'table' | 'grid')}
            value={view || 'table'}
            renderToggle={(_open, _setOpen, value) => {
                return (
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                            {value === 'table' ? (
                                <MaterialSymbolsEventList />
                            ) : (
                                <IcRoundGridView />
                            )}
                        </Button>
                    </PopoverTrigger>
                );
            }}
        />
    );
};

export default Component;
