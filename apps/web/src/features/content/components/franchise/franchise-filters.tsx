'use client';

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

import {
    DEFAULT_PREFERENCES,
    useSettingsStore,
} from '@/services/stores/settings-store';

const FranchiseFilters: FC = () => {
    const { preferences, setViewPreference, setFilterPreference } =
        useSettingsStore();

    const view = preferences.views.franchise || 'list';
    const contentTypes =
        preferences.filters.franchiseContentTypes ||
        DEFAULT_PREFERENCES.filters.franchiseContentTypes;

    const handleChangeView = (value: string) => {
        if (!value) return;
        setViewPreference('franchise', value as Hikka.View);
    };

    const handleChangeContentTypes = (value: string[]) => {
        const newValue = value.length === 0 ? ['anime'] : value;
        setFilterPreference('franchiseContentTypes', newValue);
    };

    return (
        <div className="flex gap-2">
            <ToggleGroup
                value={view}
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
                value={contentTypes}
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
