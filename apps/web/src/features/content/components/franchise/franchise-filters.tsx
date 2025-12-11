'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';

import MaterialSymbolsEventList from '@/components/icons/material-symbols/MaterialSymbolsEventList';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { createQueryString } from '@/utils/url';

interface Props {}

const FranchiseFilters: FC<Props> = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const view = (searchParams.get('view') || 'list') as Hikka.View;
    const content_types = searchParams.getAll('content_types');

    const handleChangeView = (value: string) => {
        if (!value) return;

        const query = createQueryString(
            'view',
            value,
            new URLSearchParams(searchParams),
        );
        router.replace(`${pathname}?${query}`);
    };

    const handleChangeContentTypes = (value: string[]) => {
        const query = createQueryString(
            'content_types',
            value.length === 0 ? ['anime'] : value,
            new URLSearchParams(searchParams),
        );
        router.replace(`${pathname}?${query}`);
    };

    return (
        <div className="flex gap-2">
            <ToggleGroup
                value={view || 'list'}
                type="single"
                onValueChange={handleChangeView}
            >
                <ToggleGroupItem value="list" aria-label="Таблиця">
                    <MaterialSymbolsEventList />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Сітка">
                    <MaterialSymbolsGridViewRounded />
                </ToggleGroupItem>
            </ToggleGroup>

            <Select
                multiple
                value={content_types}
                onValueChange={handleChangeContentTypes}
            >
                <SelectTrigger className="min-h-10 px-2">
                    <SelectValue maxDisplay={1} className="flex-nowrap" />
                </SelectTrigger>
                <SelectContent>
                    <SelectList>
                        <SelectGroup>
                            <SelectItem value="anime">Аніме</SelectItem>
                            <SelectItem value="manga">Манґа</SelectItem>
                            <SelectItem value="novel">Ранобе</SelectItem>
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
        </div>
    );
};

export default FranchiseFilters;
