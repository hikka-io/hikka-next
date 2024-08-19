'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import IcRoundGridView from '~icons/ic/round-grid-view';
import MaterialSymbolsEventList from '~icons/material-symbols/event-list';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import createQueryString from '@/utils/create-query-string';

const ViewCombobox = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const view = (searchParams.get('view') || 'table') as Hikka.View;

    const handleChangeView = (value: string) => {
        if (!value) return;

        const query = createQueryString(
            'view',
            value,
            new URLSearchParams(searchParams),
        );
        router.replace(`${pathname}?${query}`);
    };

    return (
        <ToggleGroup
            value={view || 'table'}
            type="single"
            onValueChange={handleChangeView}
        >
            <ToggleGroupItem value="table" aria-label="Таблиця">
                <MaterialSymbolsEventList />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Сітка">
                <IcRoundGridView />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};

export default ViewCombobox;
