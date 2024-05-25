import { Metadata } from 'next';
import { TemplateString } from 'next/dist/lib/metadata/types/metadata-types';

export const DEFAULTS = {
    siteName: 'Hikka',
    images: '/preview.jpg',
    title: {
        default: 'Hikka - енциклопедія аніме українською',
        template: '%s / Hikka',
    },
    description:
        'Hikka - українська онлайн енциклопедія аніме. Весь список аніме, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого, кастомізуй профіль та ділись з друзями.',
};

type OGImageDescriptor = {
    url: string | URL;
    secureUrl?: string | URL;
    alt?: string;
    type?: string;
    width?: string | number;
    height?: string | number;
};

type OGImage = string | OGImageDescriptor | URL;

interface Props {
    title?: string | TemplateString | null | undefined;
    description?: string | null | undefined;
    images?: OGImage | OGImage[] | undefined;
    siteName?: string;
}

const generateMetadata = ({
    title,
    description,
    images,
    siteName,
}: Props): Metadata => {
    return {
        title: title || DEFAULTS.title,
        description: description || DEFAULTS.description,
        openGraph: {
            siteName: siteName || DEFAULTS.siteName,
            title: title || DEFAULTS.title,
            description: description || DEFAULTS.description,
            images: images || DEFAULTS.images,
        },
        twitter: {
            site: siteName || DEFAULTS.siteName,
            title: title || DEFAULTS.title,
            description: description || DEFAULTS.description,
            images: images || DEFAULTS.images,
        },
    };
};

export default generateMetadata;
