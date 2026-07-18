export const FIGMA_URL =
    'https://www.figma.com/design/8Vxhnb8sJwFi7s6lKsky2W/Hikka';

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
