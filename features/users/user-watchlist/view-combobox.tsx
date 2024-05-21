'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import IcRoundGridView from '~icons/ic/round-grid-view';
import MaterialSymbolsEventList from '~icons/material-symbols/event-list';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
} from '@/components/ui/select';

import createQueryString from '@/utils/createQueryString';

type View = 'table' | 'grid';

const ViewCombobox = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const view = (searchParams.get('view') || 'table') as View;

    const handleChangeView = (value: string[]) => {
        const query = createQueryString(
            'view',
            value[0],
            new URLSearchParams(searchParams),
        );
        router.replace(`${pathname}?${query}`);
    };

    return (
        <Select value={[view]} onValueChange={handleChangeView}>
            <SelectTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                    {view === 'table' ? (
                        <MaterialSymbolsEventList />
                    ) : (
                        <IcRoundGridView />
                    )}
                </Button>
            </SelectTrigger>
            <SelectContent>
                <SelectList>
                    <SelectGroup>
                        <SelectItem value="table">
                            <MaterialSymbolsEventList /> Таблиця
                        </SelectItem>
                        <SelectItem value="grid">
                            <IcRoundGridView /> Сітка
                        </SelectItem>
                    </SelectGroup>
                </SelectList>
            </SelectContent>
        </Select>
    );
};

export default ViewCombobox;
