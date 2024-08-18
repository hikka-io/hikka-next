import { Metadata } from 'next';
import {
    DeprecatedMetadataFields,
    TemplateString,
} from 'next/dist/lib/metadata/types/metadata-types';

export const DEFAULTS = {
    siteName: 'Hikka',
    images: '/preview.jpg',
    title: {
        default: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
        template: '%s / Hikka',
    },
    description:
        'Hikka - українська онлайн енциклопедія аніме, манґи та ранобе. Весь список, манґи та ранобе, детальна інформація до кожного тайтлу та зручний інтерфейс. Заповнюй власний список переглянутого та прочитаного, кастомізуй профіль та ділись з друзями.',
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

interface Props extends Metadata {
    title?: string | TemplateString | null | undefined;
    description?: string | null | undefined;
    images?: OGImage | OGImage[] | undefined;
    siteName?: string;
    other?: {
        [name: string]: string | number | (string | number)[];
    } & DeprecatedMetadataFields;
}

const generateMetadata = ({
    title,
    description,
    images,
    siteName,
    other,
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
        other,
    };
};

export default generateMetadata;
