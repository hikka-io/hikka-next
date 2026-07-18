import type { FC, SVGProps } from 'react';

import AntDesignFilterFilled from '@/components/icons/ant-design/AntDesignFilterFilled';
import BxBxlGithub from '@/components/icons/bx/BxBxlGithub';
import BxBxlTelegram from '@/components/icons/bx/BxBxlTelegram';
import BxBxsDonateHeart from '@/components/icons/bx/BxBxsDonateHeart';
import MaterialSymbolsCalendarClockRounded from '@/components/icons/material-symbols/MaterialSymbolsCalendarClockRounded';
import MaterialSymbolsHomeRounded from '@/components/icons/material-symbols/MaterialSymbolsHomeRounded';
import MaterialSymbolsPalette from '@/components/icons/material-symbols/MaterialSymbolsPalette';
import MaterialSymbolsSearchRounded from '@/components/icons/material-symbols/MaterialSymbolsSearchRounded';
import MdiPuzzle from '@/components/icons/mdi/MdiPuzzle';
import PhTipJarFill from '@/components/icons/ph/PhTipJarFill';

/** TODO: replace with the real Figma file URL once available. */
export const FIGMA_URL = 'https://www.figma.com';

export type LogoFormat = {
    label: string;
    format: 'png' | 'jpg' | 'webp' | 'svg';
};

export const LOGO_FORMATS: LogoFormat[] = [
    { label: '.png', format: 'png' },
    { label: '.jpg', format: 'jpg' },
    { label: '.webp', format: 'webp' },
    { label: '.svg', format: 'svg' },
];

export type LogoAsset = {
    title: string;
    src: string;
    fileName: string;
    width: number;
    background: string;
    previewClassName: string;
    imageClassName: string;
};

export const LOGO_ASSETS: LogoAsset[] = [
    {
        title: 'Логотип',
        src: '/logo-dark.svg',
        fileName: 'hikka-logo-dark',
        width: 1170,
        background: '#000000',
        previewClassName: 'bg-black',
        imageClassName: 'max-h-12',
    },
    {
        title: 'Іконка',
        src: '/logo-icon.svg',
        fileName: 'hikka-icon',
        width: 512,
        background: '#000000',
        previewClassName: 'bg-black',
        imageClassName: 'max-h-16',
    },
    {
        title: 'Логотип',
        src: '/logo.svg',
        fileName: 'hikka-logo',
        width: 1170,
        background: '#ffffff',
        previewClassName: 'bg-white',
        imageClassName: 'max-h-12',
    },
];

export const FONT_WEIGHTS = [
    { title: 'Light', className: 'font-light' },
    { title: 'Regular', className: 'font-normal' },
    { title: 'Medium', className: 'font-medium' },
    { title: 'Bold', className: 'font-bold' },
];

export const FONT_SIZES = [
    { title: 'text-xs', size: '12px', className: 'text-xs' },
    { title: 'text-sm', size: '14px', className: 'text-sm' },
    { title: 'text-base', size: '16px', className: 'text-base' },
    { title: 'text-lg', size: '18px', className: 'text-lg' },
    { title: 'text-xl', size: '20px', className: 'text-xl' },
    { title: 'text-2xl', size: '24px', className: 'text-2xl' },
    { title: 'text-4xl', size: '36px', className: 'text-4xl' },
];

export type IconSet = {
    title: string;
    icons: FC<SVGProps<SVGSVGElement>>[];
};

export const ICON_SETS: IconSet[] = [
    {
        title: 'Material Symbols',
        icons: [
            MaterialSymbolsHomeRounded,
            MaterialSymbolsSearchRounded,
            MaterialSymbolsCalendarClockRounded,
            MaterialSymbolsPalette,
        ],
    },
    {
        title: 'Boxicons',
        icons: [BxBxlTelegram, BxBxlGithub, BxBxsDonateHeart],
    },
    {
        title: 'Phosphor',
        icons: [PhTipJarFill],
    },
    {
        title: 'MDI',
        icons: [MdiPuzzle],
    },
    {
        title: 'Ant Design',
        icons: [AntDesignFilterFilled],
    },
];
