import type { FC, SVGProps } from 'react';

import MaterialSymbolsCustomTypographyRounded from '@/components/icons/material-symbols/MaterialSymbolsCustomTypographyRounded';
import MaterialSymbolsEventListRounded from '@/components/icons/material-symbols/MaterialSymbolsEventListRounded';
import MaterialSymbolsLockOpenRounded from '@/components/icons/material-symbols/MaterialSymbolsLockOpenRounded';
import MaterialSymbolsNotificationsActiveRounded from '@/components/icons/material-symbols/MaterialSymbolsNotificationsActiveRounded';
import MaterialSymbolsPerson from '@/components/icons/material-symbols/MaterialSymbolsPerson';
import MdiPuzzle from '@/components/icons/mdi/MdiPuzzle';

export type SettingsMenuChild = { title: string; href: string };

export type SettingsMenuItem = {
    title: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    href: string;
    children?: SettingsMenuChild[];
};

export const SETTINGS_MENU: SettingsMenuItem[] = [
    {
        title: 'Профіль',
        icon: MaterialSymbolsPerson,
        href: '/settings/profile',
    },
    {
        title: 'Безпека',
        icon: MaterialSymbolsLockOpenRounded,
        href: '/settings/security',
    },
    {
        title: 'Список',
        icon: MaterialSymbolsEventListRounded,
        href: '/settings/list',
        children: [
            { title: 'Імпорт', href: '/settings/list/import' },
            { title: 'Експорт', href: '/settings/list/export' },
        ],
    },
    {
        title: 'Кастомізація',
        icon: MaterialSymbolsCustomTypographyRounded,
        href: '/settings/customization',
        children: [
            { title: 'Загальне', href: '/settings/customization/general' },
            { title: 'Вигляд', href: '/settings/customization/appearance' },
            { title: 'Ефекти', href: '/settings/customization/effects' },
        ],
    },
    {
        title: 'Сповіщення',
        icon: MaterialSymbolsNotificationsActiveRounded,
        href: '/settings/notifications',
    },
    {
        title: 'Застосунки',
        icon: MdiPuzzle,
        href: '/settings/applications',
        children: [
            {
                title: 'Авторизовані',
                href: '/settings/applications/authorized',
            },
            { title: 'Мої застосунки', href: '/settings/applications/clients' },
        ],
    },
];
