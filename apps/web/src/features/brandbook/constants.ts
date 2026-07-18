import type { FC, SVGProps } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import BxBxlGithub from '@/components/icons/bx/BxBxlGithub';
import BxBxlTelegram from '@/components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '@/components/icons/bx/BxBxsDonateHeart';
import Hikka from '@/components/icons/custom/Hikka';
import MAL from '@/components/icons/custom/MAL';
import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsHomeRounded from '@/components/icons/material-symbols/MaterialSymbolsHomeRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsSearchRounded from '@/components/icons/material-symbols/MaterialSymbolsSearchRounded';
import MdiPuzzle from '@/components/icons/mdi/MdiPuzzle';
import PhTipJarFill from '@/components/icons/ph/PhTipJarFill';

/** TODO: replace with the real Figma file URL once available. */
export const FIGMA_URL = 'https://www.figma.com';

export type LogoAsset = {
    title: string;
    src: string;
    fileName: string;
    format: 'SVG' | 'PNG';
    previewClassName: string;
};

export const LOGO_ASSETS: LogoAsset[] = [
    {
        title: 'Логотип (світлий)',
        src: '/logo.svg',
        fileName: 'hikka-logo.svg',
        format: 'SVG',
        previewClassName: 'bg-white',
    },
    {
        title: 'Логотип (темний)',
        src: '/logo-dark.svg',
        fileName: 'hikka-logo-dark.svg',
        format: 'SVG',
        previewClassName: 'bg-black',
    },
    {
        title: 'Іконка',
        src: '/logo-icon.png',
        fileName: 'hikka-icon.png',
        format: 'PNG',
        previewClassName: 'bg-white',
    },
];

export type BrandColor = {
    title: string;
    variable: string;
    className: string;
};

export const BRAND_COLORS: BrandColor[] = [
    {
        title: 'Primary',
        variable: '--primary',
        className: 'bg-primary border-primary-border',
    },
    {
        title: 'Secondary',
        variable: '--secondary',
        className: 'bg-secondary',
    },
    {
        title: 'Accent',
        variable: '--accent',
        className: 'bg-accent',
    },
    { title: 'Muted', variable: '--muted', className: 'bg-muted' },
    {
        title: 'Destructive',
        variable: '--destructive',
        className: 'bg-destructive border-destructive-border',
    },
    { title: 'Card', variable: '--card', className: 'bg-card' },
    {
        title: 'Background',
        variable: '--background',
        className: 'bg-background',
    },
    { title: 'Border', variable: '--border', className: 'bg-border' },
];

export const FONT_WEIGHTS = [
    { title: 'Light', className: 'font-light' },
    { title: 'Regular', className: 'font-normal' },
    { title: 'Medium', className: 'font-medium' },
    { title: 'Bold', className: 'font-bold' },
];

export type IconSet = {
    title: string;
    description: string;
    icons: FC<SVGProps<SVGSVGElement>>[];
};

export const ICON_SETS: IconSet[] = [
    {
        title: 'Material Symbols',
        description: 'Основний набір іконок інтерфейсу',
        icons: [
            MaterialSymbolsHomeRounded,
            MaterialSymbolsSearchRounded,
            MaterialSymbolsCalendarClockRounded,
            MaterialSymbolsPalette,
        ],
    },
    {
        title: 'Boxicons',
        description: 'Логотипи соцмереж та сервісів',
        icons: [BxBxlTelegram, BxBxlGithub, BxBxsDonateHeart],
    },
    {
        title: 'Phosphor',
        description: 'Додаткові іконки',
        icons: [PhTipJarFill],
    },
    {
        title: 'MDI',
        description: 'Додаткові іконки',
        icons: [MdiPuzzle],
    },
    {
        title: 'Ant Design',
        description: 'Додаткові іконки',
        icons: [AntDesignFilterFilled],
    },
    {
        title: 'Кастомні',
        description: 'Власні іконки проєкту',
        icons: [Hikka, MAL],
    },
];
