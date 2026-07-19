import type { FC } from 'react';

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
    UI_PREFS_DEFAULTS,
    useUiPreferences,
} from '@/services/stores/ui-preferences-store';

const FranchiseFilters: FC = () => {
    const view = useUiPreferences(
        (state) => state.views.franchise ?? UI_PREFS_DEFAULTS.views.franchise,
    );
    const contentTypes = useUiPreferences(
        (state) =>
            state.filters.franchiseContentTypes ??
            UI_PREFS_DEFAULTS.filters.franchiseContentTypes,
    );
    const setView = useUiPreferences((state) => state.setView);
    const setFilter = useUiPreferences((state) => state.setFilter);

    const handleChangeView = (value: string) => {
        if (!value) return;
        setView('franchise', value as Hikka.View);
    };

    const handleChangeContentTypes = (value: string[]) => {
        const newValue = value.length === 0 ? ['anime'] : value;
        setFilter('franchiseContentTypes', newValue);
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
