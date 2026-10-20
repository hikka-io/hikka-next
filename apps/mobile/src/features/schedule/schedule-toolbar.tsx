import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useCSSVariable } from 'uniwind';

import { getScheduleYears, RELEASE_STATUS, SEASON } from '@hikka/core';

import { useAuthToken } from '@/features/auth';

import {
    hasActiveScheduleFilters,
    SCHEDULE_SEASONS,
    SCHEDULE_STATUSES,
    type ScheduleFilters,
    toggleScheduleStatus,
} from './schedule-filters';

/** Compose toolbar items take image sources only; SF Symbols are iOS-only. */
const ANDROID = Platform.OS === 'android';
const FILTER_ICON = require('../../../assets/icons/filter-list.xml');

type Props = {
    filters: ScheduleFilters;
    onChange: (filters: ScheduleFilters) => void;
};

/** The web's year, season and status selects and the "Аніме у списку" switch, as one native menu of checked sections. */
const ScheduleToolbar: FC<Props> = ({ filters, onChange }) => {
    const token = useAuthToken();
    const badge = useCSSVariable('--color-primary-foreground');
    const active = hasActiveScheduleFilters(filters);

    const select = (next: ScheduleFilters) => {
        void Haptics.selectionAsync();
        onChange(next);
    };

    return (
        <Stack.Toolbar placement="right">
            <Stack.Toolbar.Menu
                icon={
                    ANDROID
                        ? FILTER_ICON
                        : active
                          ? 'line.3.horizontal.decrease.circle.fill'
                          : 'line.3.horizontal.decrease.circle'
                }
                accessibilityLabel="Фільтри"
            >
                {ANDROID && active ? (
                    <Stack.Toolbar.Badge
                        style={{
                            backgroundColor:
                                typeof badge === 'string' ? badge : undefined,
                        }}
                    />
                ) : null}
                <Stack.Toolbar.Menu inline title="Рік">
                    {getScheduleYears().map((year) => (
                        <Stack.Toolbar.MenuAction
                            key={year}
                            isOn={filters.year === year}
                            onPress={() => select({ ...filters, year })}
                        >
                            {String(year)}
                        </Stack.Toolbar.MenuAction>
                    ))}
                </Stack.Toolbar.Menu>
                <Stack.Toolbar.Menu inline title="Сезон">
                    {SCHEDULE_SEASONS.map((season) => (
                        <Stack.Toolbar.MenuAction
                            key={season}
                            isOn={filters.season === season}
                            onPress={() => select({ ...filters, season })}
                        >
                            {SEASON[season].title_ua}
                        </Stack.Toolbar.MenuAction>
                    ))}
                </Stack.Toolbar.Menu>
                <Stack.Toolbar.Menu inline title="Статус">
                    {SCHEDULE_STATUSES.map((status) => (
                        <Stack.Toolbar.MenuAction
                            key={status}
                            isOn={filters.status.includes(status)}
                            onPress={() =>
                                select(toggleScheduleStatus(filters, status))
                            }
                        >
                            {RELEASE_STATUS[status].title_ua}
                        </Stack.Toolbar.MenuAction>
                    ))}
                </Stack.Toolbar.Menu>
                {token ? (
                    <Stack.Toolbar.Menu inline title="Список">
                        <Stack.Toolbar.MenuAction
                            isOn={filters.onlyWatch}
                            onPress={() =>
                                select({
                                    ...filters,
                                    onlyWatch: !filters.onlyWatch,
                                })
                            }
                        >
                            Аніме у списку
                        </Stack.Toolbar.MenuAction>
                    </Stack.Toolbar.Menu>
                ) : null}
            </Stack.Toolbar.Menu>
        </Stack.Toolbar>
    );
};

export default ScheduleToolbar;
