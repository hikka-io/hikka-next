'use client';

import MaterialSymbolsEventList from '@/components/icons/material-symbols/MaterialSymbolsEventList';
import { MaterialSymbolsGridViewRounded } from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useSettingsStore } from '@/services/stores/settings-store';

const ViewCombobox = () => {
    const { preferences, setViewPreference } = useSettingsStore();

    const view = preferences.views.userlist || 'table';

    const handleChangeView = (value: string) => {
        if (!value) return;
        setViewPreference('userlist', value as Hikka.View);
    };

    return (
        <ToggleGroup
            value={view}
            type="single"
            onValueChange={handleChangeView}
        >
            <ToggleGroupItem value="table" aria-label="Таблиця">
                <MaterialSymbolsEventList />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Сітка">
                <MaterialSymbolsGridViewRounded />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};

export default ViewCombobox;
